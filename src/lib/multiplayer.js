// Multiplayer service using PeerJS (WebRTC)
// Enables peer-to-peer online chess games

import Peer from 'peerjs';

// Generate a random room code
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Create the multiplayer service
export const createMultiplayerService = () => {
  let peer = null;
  let connection = null;
  let roomCode = null;
  let isHost = false;
  let onMessageCallback = null;
  let onConnectionCallback = null;
  let onDisconnectCallback = null;
  let onErrorCallback = null;

  const service = {
    // Initialize as host (create room)
    createRoom: () => {
      return new Promise((resolve, reject) => {
        roomCode = generateRoomCode();
        isHost = true;

        // Use room code as peer ID for easy joining
        peer = new Peer(`chess-${roomCode}`, {
          debug: 1,
        });

        peer.on('open', (id) => {
          console.log('Room created with code:', roomCode);
          resolve(roomCode);
        });

        peer.on('connection', (conn) => {
          connection = conn;
          setupConnection(conn);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
          if (err.type === 'unavailable-id') {
            // Room code already taken, generate new one
            peer.destroy();
            roomCode = generateRoomCode();
            peer = new Peer(`chess-${roomCode}`, { debug: 1 });
            peer.on('open', () => resolve(roomCode));
            peer.on('connection', (conn) => {
              connection = conn;
              setupConnection(conn);
            });
          } else {
            onErrorCallback?.(err);
            reject(err);
          }
        });
      });
    },

    // Join an existing room
    joinRoom: (code) => {
      return new Promise((resolve, reject) => {
        roomCode = code.toUpperCase();
        isHost = false;

        peer = new Peer(undefined, { debug: 1 });

        peer.on('open', () => {
          // Connect to the host
          connection = peer.connect(`chess-${roomCode}`, {
            reliable: true,
          });

          connection.on('open', () => {
            console.log('Connected to room:', roomCode);
            setupConnection(connection);
            resolve(roomCode);
          });

          connection.on('error', (err) => {
            console.error('Connection error:', err);
            reject(err);
          });
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
          if (err.type === 'peer-unavailable') {
            reject(new Error('Room not found. Check the code and try again.'));
          } else {
            reject(err);
          }
        });

        // Timeout if connection takes too long
        setTimeout(() => {
          if (!connection?.open) {
            reject(new Error('Connection timeout. Room may not exist.'));
          }
        }, 10000);
      });
    },

    // Send a message to the other player
    send: (type, data) => {
      if (connection?.open) {
        connection.send({ type, data, timestamp: Date.now() });
      }
    },

    // Send game move
    sendMove: (from, to, piece) => {
      service.send('move', { from, to, piece });
    },

    // Send game state sync
    sendGameState: (board, currentTurn, moveHistory) => {
      service.send('sync', { board, currentTurn, moveHistory });
    },

    // Send game end
    sendGameEnd: (winner) => {
      service.send('gameEnd', { winner });
    },

    // Send chat message
    sendChat: (message) => {
      service.send('chat', { message });
    },

    // Register callbacks
    onMessage: (callback) => {
      onMessageCallback = callback;
    },

    onConnection: (callback) => {
      onConnectionCallback = callback;
    },

    onDisconnect: (callback) => {
      onDisconnectCallback = callback;
    },

    onError: (callback) => {
      onErrorCallback = callback;
    },

    // Get connection status
    isConnected: () => connection?.open ?? false,
    isHosting: () => isHost,
    getRoomCode: () => roomCode,

    // Disconnect and cleanup
    disconnect: () => {
      if (connection) {
        connection.close();
        connection = null;
      }
      if (peer) {
        peer.destroy();
        peer = null;
      }
      roomCode = null;
      isHost = false;
    },
  };

  // Setup connection event handlers
  const setupConnection = (conn) => {
    conn.on('data', (data) => {
      console.log('Received:', data);
      onMessageCallback?.(data);
    });

    conn.on('open', () => {
      console.log('Connection established');
      onConnectionCallback?.();
    });

    conn.on('close', () => {
      console.log('Connection closed');
      onDisconnectCallback?.();
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      onErrorCallback?.(err);
    });
  };

  return service;
};

// Singleton instance
let multiplayerInstance = null;

export const getMultiplayer = () => {
  if (!multiplayerInstance) {
    multiplayerInstance = createMultiplayerService();
  }
  return multiplayerInstance;
};

export const resetMultiplayer = () => {
  if (multiplayerInstance) {
    multiplayerInstance.disconnect();
    multiplayerInstance = null;
  }
};
