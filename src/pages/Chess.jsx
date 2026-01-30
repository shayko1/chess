import React, { useState, useEffect, useCallback } from 'react';
import { storage } from '@/api/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ArrowRight, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMultiplayer, resetMultiplayer } from '@/lib/multiplayer';

// Components
import ChessBoard from '../components/chess/ChessBoard';
import GameModeSelector from '../components/chess/GameModeSelector';
import ProfileSelector from '../components/chess/ProfileSelector';
import AISelector, { AI_LEVELS } from '../components/chess/AISelector';
import ProfileStats from '../components/chess/ProfileStats';
import BadgeDisplay from '../components/chess/BadgeDisplay';
import OnlineRoom from '../components/chess/OnlineRoom';

export default function ChessPage() {
  const [step, setStep] = useState('mode'); // mode, white, black, online, game
  const [gameMode, setGameMode] = useState('learning'); // learning, pro, online
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [isAI, setIsAI] = useState(false);
  const [aiLevel, setAiLevel] = useState('medium');

  // Online multiplayer state
  const [isOnline, setIsOnline] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteMove, setRemoteMove] = useState(null);
  const [myColor, setMyColor] = useState(null); // 'white' or 'black'

  const queryClient = useQueryClient();
  const multiplayer = getMultiplayer();

  // Setup multiplayer callbacks
  useEffect(() => {
    multiplayer.onMessage((data) => {
      console.log('Received message:', data);

      if (data.type === 'move') {
        setRemoteMove(data.data);
      } else if (data.type === 'playerInfo') {
        // Opponent sent their info
        if (isHost) {
          setBlackPlayer({ name: data.data.name, avatar: data.data.avatar, id: 'remote' });
        } else {
          setWhitePlayer({ name: data.data.name, avatar: data.data.avatar, id: 'remote' });
        }
      } else if (data.type === 'startGame') {
        setStep('game');
      }
    });

    multiplayer.onConnection(() => {
      setIsConnected(true);
      setConnectionError(null);

      // Send our player info
      const myProfile = isHost ? whitePlayer : blackPlayer;
      if (myProfile) {
        multiplayer.send('playerInfo', { name: myProfile.name, avatar: myProfile.avatar });
      }
    });

    multiplayer.onDisconnect(() => {
      setIsConnected(false);
      if (step === 'game') {
        setConnectionError('השחקן השני התנתק');
      }
    });

    multiplayer.onError((err) => {
      setConnectionError(err.message || 'שגיאת חיבור');
      setIsConnecting(false);
    });

    return () => {
      // Cleanup on unmount
    };
  }, [isHost, whitePlayer, blackPlayer, step]);

  // Fetch Profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => storage.PlayerProfile.list(),
    initialData: []
  });

  // Mutations
  const createProfileMutation = useMutation({
    mutationFn: (data) => storage.PlayerProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries(['profiles'])
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => storage.PlayerProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles'])
  });

  const recordMatchMutation = useMutation({
    mutationFn: (data) => storage.MatchHistory.create(data),
    onSuccess: () => queryClient.invalidateQueries(['matches'])
  });

  // Handlers
  const handleModeSelect = (mode) => {
    setGameMode(mode);
    if (mode === 'online') {
      setIsOnline(true);
      setStep('white'); // First select your profile, then go to online room
    } else {
      setIsOnline(false);
      setStep('white');
    }
  };

  const handleWhiteSelect = (profile) => {
    setWhitePlayer(profile);
    if (gameMode === 'online') {
      setMyColor('white');
      setIsHost(true);
      setStep('online');
    } else {
      setStep('black');
    }
  };

  const handleBlackSelect = (profile) => {
    setBlackPlayer(profile);
    setIsAI(false);
    setStep('game');
  };

  const handleAISelect = (level) => {
    setAiLevel(level);
    setIsAI(true);
    setBlackPlayer({
      name: `רובוט ${AI_LEVELS.find(l => l.id === level)?.name || ''}`,
      avatar: AI_LEVELS.find(l => l.id === level)?.emoji || '🤖',
      id: 'ai'
    });
    setStep('game');
  };

  // Online handlers
  const handleCreateRoom = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const code = await multiplayer.createRoom();
      setRoomCode(code);
      setIsHost(true);
      setMyColor('white');
    } catch (err) {
      setConnectionError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinRoom = async (code) => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      await multiplayer.joinRoom(code);
      setRoomCode(code);
      setIsHost(false);
      setMyColor('black');
      // As joiner, we're black player - set our profile
      setBlackPlayer(whitePlayer); // Use the profile we selected
      setWhitePlayer({ name: 'מחכה...', avatar: '⏳', id: 'remote' });
    } catch (err) {
      setConnectionError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    multiplayer.disconnect();
    setRoomCode(null);
    setIsConnected(false);
    setIsHost(false);
    setMyColor(null);
    setConnectionError(null);
  };

  // When connection is established and we're host, wait for opponent then start
  useEffect(() => {
    if (isConnected && isHost && blackPlayer?.id === 'remote') {
      // Send start game signal
      setTimeout(() => {
        multiplayer.send('startGame', {});
        setStep('game');
      }, 500);
    }
  }, [isConnected, isHost, blackPlayer]);

  // Handle remote moves
  const handleLocalMove = useCallback((from, to, piece) => {
    if (isOnline && multiplayer.isConnected()) {
      multiplayer.sendMove(from, to, piece);
    }
  }, [isOnline]);

  const handleGameEnd = async (winner) => {
    // Update stats only for local players
    if (!isOnline) {
      if (winner === 'white') {
        if (whitePlayer?.id !== 'ai' && whitePlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: whitePlayer.id,
            data: { ...whitePlayer, wins: (whitePlayer.wins || 0) + 1, games_played: (whitePlayer.games_played || 0) + 1 }
          });
        }
        if (blackPlayer?.id !== 'ai' && blackPlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: blackPlayer.id,
            data: { ...blackPlayer, losses: (blackPlayer.losses || 0) + 1, games_played: (blackPlayer.games_played || 0) + 1 }
          });
        }
      } else if (winner === 'black') {
        if (blackPlayer?.id !== 'ai' && blackPlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: blackPlayer.id,
            data: { ...blackPlayer, wins: (blackPlayer.wins || 0) + 1, games_played: (blackPlayer.games_played || 0) + 1 }
          });
        }
        if (whitePlayer?.id !== 'ai' && whitePlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: whitePlayer.id,
            data: { ...whitePlayer, losses: (whitePlayer.losses || 0) + 1, games_played: (whitePlayer.games_played || 0) + 1 }
          });
        }
      } else {
        if (whitePlayer?.id !== 'ai' && whitePlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: whitePlayer.id,
            data: { ...whitePlayer, draws: (whitePlayer.draws || 0) + 1, games_played: (whitePlayer.games_played || 0) + 1 }
          });
        }
        if (blackPlayer?.id !== 'ai' && blackPlayer?.id !== 'remote') {
          await updateProfileMutation.mutateAsync({
            id: blackPlayer.id,
            data: { ...blackPlayer, draws: (blackPlayer.draws || 0) + 1, games_played: (blackPlayer.games_played || 0) + 1 }
          });
        }
      }

      // Record Match
      await recordMatchMutation.mutateAsync({
        white_player_id: whitePlayer.id,
        black_player_id: blackPlayer.id,
        white_player_name: whitePlayer.name,
        black_player_name: blackPlayer.name,
        winner: winner,
        winner_name: winner === 'white' ? whitePlayer.name : (winner === 'black' ? blackPlayer.name : 'Draw'),
        game_mode: gameMode,
        total_moves: 0,
        duration_minutes: 0
      });
    }
  };

  const handleReset = () => {
    if (isOnline) {
      handleDisconnect();
    }
    resetMultiplayer();
    setStep('mode');
    setWhitePlayer(null);
    setBlackPlayer(null);
    setIsAI(false);
    setIsOnline(false);
    setRoomCode(null);
    setIsConnected(false);
    setRemoteMove(null);
    setMyColor(null);
  };

  const handleBack = () => {
    if (step === 'game') {
      if (isOnline) {
        handleDisconnect();
        setStep('online');
      } else {
        setStep('black');
      }
    } else if (step === 'black') {
      setStep('white');
    } else if (step === 'online') {
      handleDisconnect();
      setStep('white');
    } else if (step === 'white') {
      setStep('mode');
      setIsOnline(false);
      setGameMode('learning');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" dir="rtl">

      {/* Back Button */}
      {step !== 'mode' && (
        <div className="w-full max-w-4xl mb-6 flex justify-start">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-slate-500 hover:text-purple-600"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            חזרה
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* STEP 1: Mode Selection */}
        {step === 'mode' && (
          <motion.div
            key="mode"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              איזה סוג משחק נשחק היום?
            </h2>
            <GameModeSelector mode={gameMode} onChange={handleModeSelect} />
          </motion.div>
        )}

        {/* STEP 2: Player Selection (Your Profile) */}
        {step === 'white' && (
          <motion.div
            key="white"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                {gameMode === 'online' ? 'בחר את הפרופיל שלך' : 'מי משחק בלבן?'}
              </h2>
              <p className="text-slate-500">
                {gameMode === 'online' ? 'זה יהיה השם שלך במשחק' : 'השחקן הלבן מתחיל ראשון!'}
              </p>
            </div>

            {profilesLoading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-500" /></div>
            ) : (
              <ProfileSelector
                profiles={profiles}
                selectedProfile={whitePlayer}
                onSelect={handleWhiteSelect}
                onCreate={(data) => createProfileMutation.mutateAsync(data)}
                position="white"
              />
            )}
          </motion.div>
        )}

        {/* STEP 3a: Online Room (for online mode) */}
        {step === 'online' && (
          <motion.div
            key="online"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md space-y-6"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wifi className="w-6 h-6 text-blue-500" />
                <h2 className="text-3xl font-bold text-slate-800">משחק אונליין</h2>
              </div>
              <p className="text-slate-500">צור חדר חדש או הצטרף לחדר קיים</p>
            </div>

            <OnlineRoom
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              isConnecting={isConnecting}
              error={connectionError}
              roomCode={roomCode}
              isConnected={isConnected}
              onDisconnect={handleDisconnect}
            />
          </motion.div>
        )}

        {/* STEP 3b: Black Player Selection (for local modes) */}
        {step === 'black' && !isOnline && (
          <motion.div
            key="black"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-4xl space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">מי משחק בשחור?</h2>
              <p className="text-slate-500">בחרו חבר או שחקו נגד המחשב</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option A: Play against AI */}
              <div className="space-y-4">
                <h3 className="font-bold text-center text-indigo-600">נגד המחשב</h3>
                <AISelector selectedLevel={aiLevel} onSelect={handleAISelect} />
              </div>

              {/* Option B: Play against human */}
              <div className="space-y-4">
                <h3 className="font-bold text-center text-purple-600">נגד חבר</h3>
                {profilesLoading ? (
                  <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-500" /></div>
                ) : (
                  <ProfileSelector
                    profiles={profiles.filter(p => p.id !== whitePlayer?.id)}
                    selectedProfile={blackPlayer}
                    onSelect={handleBlackSelect}
                    onCreate={(data) => createProfileMutation.mutateAsync(data)}
                    position="black"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Game */}
        {step === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {/* Online connection status */}
            {isOnline && (
              <div className="flex justify-center mb-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {isConnected ? 'מחובר' : 'מנותק'}
                  {roomCode && <span className="text-xs opacity-70">| קוד: {roomCode}</span>}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">

              {/* Left Side: White Player Stats */}
              <div className="hidden md:block w-64 space-y-4">
                <ProfileStats profile={whitePlayer} />
                {!isOnline && whitePlayer?.id !== 'remote' && (
                  <div className="bg-white/50 backdrop-blur rounded-xl p-4 border border-purple-100">
                    <h4 className="font-bold text-sm text-purple-900 mb-2">הגביעים שלי</h4>
                    <BadgeDisplay badges={whitePlayer?.badges || []} />
                  </div>
                )}
                {myColor === 'white' && (
                  <div className="bg-blue-100 text-blue-800 text-center py-2 px-4 rounded-xl text-sm font-bold">
                    אתה משחק כאן
                  </div>
                )}
              </div>

              {/* Center: Game Board */}
              <div className="flex-1 max-w-2xl">
                <ChessBoard
                  gameMode={isOnline ? 'pro' : gameMode}
                  whitePlayer={whitePlayer?.name}
                  blackPlayer={blackPlayer?.name}
                  playAgainstAI={isAI}
                  aiLevel={aiLevel}
                  onGameEnd={handleGameEnd}
                  isOnline={isOnline}
                  myColor={myColor}
                  remoteMove={remoteMove}
                  onLocalMove={handleLocalMove}
                  onRemoteMoveProcessed={() => setRemoteMove(null)}
                />

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={handleReset} className="text-slate-400 hover:text-red-500">
                    סיים משחק ויציאה
                  </Button>
                </div>
              </div>

              {/* Right Side: Black Player Stats */}
              <div className="hidden md:block w-64 space-y-4">
                {isAI ? (
                  <div className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl text-center">
                    <div className="text-6xl mb-4">{blackPlayer?.avatar}</div>
                    <h3 className="font-bold text-xl">{blackPlayer?.name}</h3>
                    <p className="text-indigo-300 text-sm mt-2">רמת קושי: {AI_LEVELS.find(l=>l.id===aiLevel)?.name}</p>
                  </div>
                ) : (
                  <>
                    <ProfileStats profile={blackPlayer} />
                    {!isOnline && blackPlayer?.id !== 'remote' && (
                      <div className="bg-white/50 backdrop-blur rounded-xl p-4 border border-purple-100">
                        <h4 className="font-bold text-sm text-purple-900 mb-2">הגביעים שלי</h4>
                        <BadgeDisplay badges={blackPlayer?.badges || []} />
                      </div>
                    )}
                  </>
                )}
                {myColor === 'black' && (
                  <div className="bg-blue-100 text-blue-800 text-center py-2 px-4 rounded-xl text-sm font-bold">
                    אתה משחק כאן
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
