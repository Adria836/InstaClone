import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { ChatProvider } from './context/ChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PostProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </PostProvider>
    </AuthProvider>
  </StrictMode>,
);
