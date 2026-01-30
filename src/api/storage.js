// LocalStorage-based storage service
// Replaces Base44 entities API

const STORAGE_KEYS = {
  profiles: 'chess_profiles',
  matches: 'chess_matches'
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storage = {
  PlayerProfile: {
    list: async () => {
      return getFromStorage(STORAGE_KEYS.profiles);
    },

    create: async (data) => {
      const profiles = getFromStorage(STORAGE_KEYS.profiles);
      const newProfile = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        games_played: data.games_played || 0,
        badges: data.badges || []
      };
      profiles.push(newProfile);
      saveToStorage(STORAGE_KEYS.profiles, profiles);
      return newProfile;
    },

    update: async (id, data) => {
      const profiles = getFromStorage(STORAGE_KEYS.profiles);
      const index = profiles.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error(`Profile ${id} not found`);
      }
      profiles[index] = { ...profiles[index], ...data, updated_at: new Date().toISOString() };
      saveToStorage(STORAGE_KEYS.profiles, profiles);
      return profiles[index];
    },

    delete: async (id) => {
      const profiles = getFromStorage(STORAGE_KEYS.profiles);
      const filtered = profiles.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.profiles, filtered);
    },

    get: async (id) => {
      const profiles = getFromStorage(STORAGE_KEYS.profiles);
      return profiles.find(p => p.id === id) || null;
    }
  },

  MatchHistory: {
    list: async () => {
      return getFromStorage(STORAGE_KEYS.matches);
    },

    create: async (data) => {
      const matches = getFromStorage(STORAGE_KEYS.matches);
      const newMatch = {
        id: generateId(),
        ...data,
        played_at: new Date().toISOString()
      };
      matches.push(newMatch);
      saveToStorage(STORAGE_KEYS.matches, matches);
      return newMatch;
    },

    delete: async (id) => {
      const matches = getFromStorage(STORAGE_KEYS.matches);
      const filtered = matches.filter(m => m.id !== id);
      saveToStorage(STORAGE_KEYS.matches, filtered);
    }
  }
};
