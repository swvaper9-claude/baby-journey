import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDL80TWON_dUARfnEnlffupL8rgJw2noys",
  authDomain: "baby-journey-ca7a9.firebaseapp.com",
  databaseURL: "https://baby-journey-ca7a9-default-rtdb.firebaseio.com",
  projectId: "baby-journey-ca7a9",
  storageBucket: "baby-journey-ca7a9.firebasestorage.app",
  messagingSenderId: "180113526494",
  appId: "1:180113526494:web:2c40414824416598a47c4f",
  measurementId: "G-9SNK97ZDL0"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ── window.storage → Firebase Realtime Database ──────────────
window.storage = {
  get: async (key, shared = false) => {
    return new Promise((resolve, reject) => {
      const path = shared ? `shared/${key}` : `private/${key}`;
      const dbRef = ref(db, path);
      onValue(dbRef, (snapshot) => {
        const value = snapshot.val();
        if (value === null) {
          reject(new Error('Key not found'));
        } else {
          resolve({ key, value, shared });
        }
      }, { onlyOnce: true });
    });
  },

  set: async (key, value, shared = false) => {
    const path = shared ? `shared/${key}` : `private/${key}`;
    const dbRef = ref(db, path);
    await set(dbRef, value);
    return { key, value, shared };
  },

  delete: async (key, shared = false) => {
    const path = shared ? `shared/${key}` : `private/${key}`;
    const dbRef = ref(db, path);
    await set(dbRef, null);
    return { key, deleted: true, shared };
  },

  // 실시간 구독 (5초 폴링 대신 진짜 실시간)
  subscribe: (key, shared = false, callback) => {
    const path = shared ? `shared/${key}` : `private/${key}`;
    const dbRef = ref(db, path);
    return onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) callback({ key, value, shared });
    });
  }
};

// 실시간 구독을 App에서 쓸 수 있게 export
window.firebaseDb = db;
window.firebaseRef = ref;
window.firebaseOnValue = onValue;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
