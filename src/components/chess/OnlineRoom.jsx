import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Loader2, Globe, Users, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OnlineRoom({
  onCreateRoom,
  onJoinRoom,
  isConnecting,
  error,
  roomCode,
  isConnected,
  onDisconnect
}) {
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState(null); // 'create' or 'join'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (joinCode.length >= 4) {
      onJoinRoom(joinCode.toUpperCase());
    }
  };

  // Show connected state
  if (isConnected && roomCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 shadow-xl border-2 border-green-200 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wifi className="w-6 h-6 text-green-600 animate-pulse" />
          <span className="text-green-700 font-bold text-lg">מחובר!</span>
        </div>
        <p className="text-green-800 mb-2">קוד החדר:</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-3xl font-mono font-bold text-green-900 tracking-widest">
            {roomCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-green-200 hover:bg-green-300 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-700" /> : <Copy className="w-5 h-5 text-green-700" />}
          </button>
        </div>
        <p className="text-green-600 text-sm mb-6">ממתין לשחקן השני...</p>
        <Button
          variant="outline"
          onClick={onDisconnect}
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          <WifiOff className="w-4 h-4 ml-2" />
          התנתק
        </Button>
      </motion.div>
    );
  }

  // Show waiting room after creating
  if (roomCode && !isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200 text-center"
      >
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-bold text-purple-900 mb-4">החדר נוצר!</h3>
        <p className="text-purple-700 mb-2">שתפו את הקוד עם חבר:</p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-4xl font-mono font-bold text-purple-900 tracking-widest bg-white/50 px-6 py-3 rounded-xl">
            {roomCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-3 rounded-xl bg-purple-200 hover:bg-purple-300 transition-colors"
          >
            {copied ? <Check className="w-6 h-6 text-purple-700" /> : <Copy className="w-6 h-6 text-purple-700" />}
          </button>
        </div>
        <p className="text-purple-500 text-sm animate-pulse mb-6">ממתין לשחקן השני להתחבר...</p>
        <Button
          variant="outline"
          onClick={onDisconnect}
          className="text-slate-500 hover:text-red-500"
        >
          ביטול
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      {!mode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('create')}
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg"
          >
            <Globe className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">צור חדר</h3>
            <p className="text-white/80 text-sm">התחל משחק חדש ושתף קוד</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('join')}
            className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl p-6 shadow-lg"
          >
            <Users className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">הצטרף לחדר</h3>
            <p className="text-white/80 text-sm">הכנס קוד והצטרף למשחק</p>
          </motion.button>
        </motion.div>
      )}

      {/* Create Room */}
      {mode === 'create' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200"
        >
          <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">צור חדר חדש</h3>
          <p className="text-purple-700 text-center mb-6">
            לחץ על הכפתור ליצירת חדר. תקבל קוד לשיתוף עם חבר.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setMode(null)}
              className="flex-1"
              disabled={isConnecting}
            >
              חזרה
            </Button>
            <Button
              onClick={onCreateRoom}
              disabled={isConnecting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  יוצר חדר...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 ml-2" />
                  צור חדר
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Join Room */}
      {mode === 'join' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl p-8 shadow-xl border-2 border-indigo-200"
        >
          <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">הצטרף לחדר</h3>
          <p className="text-indigo-700 text-center mb-6">
            הכנס את הקוד שקיבלת מהחבר שלך
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <Input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="הכנס קוד (6 תווים)"
            className="text-center text-2xl font-mono tracking-widest mb-4 h-14"
            maxLength={6}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setMode(null)}
              className="flex-1"
              disabled={isConnecting}
            >
              חזרה
            </Button>
            <Button
              onClick={handleJoin}
              disabled={isConnecting || joinCode.length < 4}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 ml-2" />
                  הצטרף
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
