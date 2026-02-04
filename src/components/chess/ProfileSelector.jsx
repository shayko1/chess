import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Trophy, Star, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AVATARS = ['🦄', '🐉', '🧙‍♀️', '👸', '🦋', '🦅', '🏰', '🌸', '🔮', '⭐', '🦁', '🐯', '🐼', '🐨', '🐸', '🐙'];

export default function ProfileSelector({ 
  profiles, 
  selectedProfile, 
  onSelect, 
  onCreate,
  position = "white",
  excludeAvatar = null
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);

  const handleCreate = async () => {
    if (newName.trim()) {
      const newProfile = await onCreate({ name: newName.trim(), avatar: newAvatar });
      setNewName('');
      setNewAvatar(AVATARS[0]);
      setShowCreate(false);
      if (newProfile) {
        onSelect(newProfile);
      }
    }
  };

  const isWhite = position === "white";

  return (
    <div className={`p-5 rounded-3xl relative overflow-hidden backdrop-blur-md border border-white/40 shadow-xl ${
      isWhite 
        ? 'bg-white/40' 
        : 'bg-indigo-900/40 text-white'
    }`} dir="rtl">
      {/* Magical Glow Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isWhite ? 'from-pink-300/30 to-purple-300/0' : 'from-purple-500/20 to-indigo-500/0'} blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none`} />

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className={`p-2 rounded-full ${isWhite ? 'bg-white/50 text-purple-600' : 'bg-indigo-950/50 text-purple-300'} shadow-sm`}>
          <User className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg tracking-wide drop-shadow-sm">{isWhite ? 'שחקן לבן ✨' : 'שחקן שחור 🔮'}</h3>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 relative z-10">
        {profiles.map(profile => (
          <motion.button
            key={profile.id}
            className={`
              flex flex-col items-center gap-2 px-6 py-4 rounded-3xl transition-all border-2 min-w-[100px]
              ${selectedProfile?.id === profile.id 
                ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white border-white shadow-[0_10px_20px_rgba(168,85,247,0.4)] scale-110 -rotate-2 z-10' 
                : isWhite 
                  ? 'bg-white/70 hover:bg-white text-purple-900 border-white/60 shadow-md hover:scale-105' 
                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-500/30 text-indigo-100 hover:scale-105'}
            `}
            onClick={() => onSelect(profile)}
            whileHover={{ scale: selectedProfile?.id === profile.id ? 1.15 : 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-4xl drop-shadow-lg filter transition-transform duration-300 hover:rotate-12">{profile.avatar}</span>
            <span className="font-bold text-lg">{profile.name}</span>
            {profile.wins > 0 && (
              <span className="flex items-center text-xs bg-black/20 px-2 py-1 rounded-full font-bold backdrop-blur-sm">
                <Trophy className="w-3 h-3 text-yellow-300 mr-1" />
                {profile.wins}
              </span>
            )}
          </motion.button>
        ))}

        <motion.button
          className={`
            flex items-center gap-1 px-4 py-3 rounded-2xl border-2 border-dashed transition-all
            ${isWhite 
              ? 'border-purple-300/60 text-purple-700 hover:bg-purple-50/50 hover:border-purple-400' 
              : 'border-indigo-400/30 text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-400/60'}
          `}
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-current rounded-full p-0.5 text-white/90">
            <Plus className="w-4 h-4" />
          </div>
          <span className="font-semibold">חדש</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className={`rounded-2xl p-4 mt-2 border border-white/20 shadow-inner ${isWhite ? 'bg-white/70' : 'bg-indigo-950/60'}`}
          >
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              יצירת שחקן חדש
            </h4>
            
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="שם השחקן..."
              className="mb-3"
            />

            <div className="mb-3">
              <p className="text-sm mb-2 opacity-70">בחר אווטאר:</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(avatar => {
                  const isExcluded = avatar === excludeAvatar;
                  return (
                  <button
                    key={avatar}
                    disabled={isExcluded}
                    className={`
                      w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all
                      ${newAvatar === avatar 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg' 
                        : isExcluded
                          ? 'opacity-30 cursor-not-allowed grayscale bg-gray-200'
                          : isWhite ? 'bg-purple-100 hover:bg-purple-200' : 'bg-purple-700 hover:bg-purple-600'}
                    `}
                    onClick={() => !isExcluded && setNewAvatar(avatar)}
                    title={isExcluded ? 'כבר בשימוש על ידי השחקן השני' : ''}
                  >
                    {avatar}
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Check className="w-4 h-4 ml-2" />
                יצירה
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreate(false)}
                className={isWhite ? '' : 'text-white border-purple-400'}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}