
'use client';
import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  email: string | null;
  username: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const getInitialAuthState = (): { isAuthenticated: boolean; user: AuthUser | null; accessToken: string | null, email: string | null, username: string | null } => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, accessToken: null, email: null, username: null };
  }
  try {
    const accessToken = localStorage.getItem('access_token');
    const userString = localStorage.getItem('user');
    
    if (accessToken && userString) {
      const user: AuthUser = JSON.parse(userString);
      return { isAuthenticated: true, user, accessToken, email: user.email, username: user.username };
    }
  } catch (error) {
    console.error("Could not access localStorage for auth state", error);
  }
  return { isAuthenticated: false, user: null, accessToken: null, email: null, username: null };
};


export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuthState(),
  login: (user, token) => {
    try {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
       console.error("Could not save auth state to localStorage", error);
    }
    set({ isAuthenticated: true, user, accessToken: token, email: user.email, username: user.username });
  },
  logout: () => {
     try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (error) {
        console.error("Could not remove auth state from localStorage", error);
    }
    set({ isAuthenticated: false, user: null, accessToken: null, email: null, username: null });
  },
}));

    