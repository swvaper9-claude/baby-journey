import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ── window.storage 폴리필 (Vercel 배포용 - Firebase 대신 간단한 공유 저장소) ──
// 실제 배포에서는 localStorage 기반으로 동작하되
// 추후 Firebase로 교체 가능한 구조

const STORAGE_PREFIX = "babyjourney_shared_";

window.storage = {
  get: async (key, shared = false) => {
    try {
      const k = shared ? STORAGE_PREFIX + key : key;
      const value = localStorage.getItem(k);
      if (value === null) throw new Error("Key not found");
      return { key, value, shared };
    } catch(e) {
      throw e;
    }
  },
  set: async (key, value, shared = false) => {
    try {
      const k = shared ? STORAGE_PREFIX + key : key;
      localStorage.setItem(k, value);
      return { key, value, shared };
    } catch(e) {
      throw e;
    }
  },
  delete: async (key, shared = false) => {
    try {
      const k = shared ? STORAGE_PREFIX + key : key;
      localStorage.removeItem(k);
      return { key, deleted: true, shared };
    } catch(e) {
      throw e;
    }
  },
  list: async (prefix = "", shared = false) => {
    const keys = [];
    for(let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const base = shared ? STORAGE_PREFIX : "";
      if(k.startsWith(base + prefix)) {
        keys.push(k.replace(base, ""));
      }
    }
    return { keys, prefix, shared };
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
