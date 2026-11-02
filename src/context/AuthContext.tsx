import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, username: string, fullName: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string, emailFallback?: string): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
      }

      if (profile) {
        return {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name || profile.username,
          avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          bio: profile.bio || '',
          website: profile.website || '',
          isVerified: profile.is_verified || false,
          followersCount: profile.followers_count || 0,
          followingCount: profile.following_count || 0,
        };
      }

      // If user row in profiles doesn't exist yet, build minimal user
      const fallbackName = emailFallback ? emailFallback.split('@')[0] : 'usuario';
      return {
        id: userId,
        username: fallbackName,
        fullName: fallbackName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: '',
        followersCount: 0,
        followingCount: 0,
      };
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Check existing session on boot
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email);
        if (mounted) setUser(profile);
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setIsLoading(false);
    });

    // 2. Listen for realtime auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email);
        if (mounted) setUser(profile);
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanInput = emailOrUsername.trim().toLowerCase();

    if (!cleanInput || !password) {
      return { success: false, error: 'Preencha o e-mail/usuário e a senha.' };
    }

    try {
      let emailToLogin = cleanInput;

      // If the user typed a username without @, find their registered email in profiles/auth
      if (!cleanInput.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', cleanInput)
          .maybeSingle();

        if (!profile) {
          return { success: false, error: 'Nome de usuário não encontrado no Supabase.' };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToLogin,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id, data.user.email);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Credenciais inválidas.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao conectar ao Supabase.' };
    }
  };

  const signup = async (email: string, username: string, fullName: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanEmail || !cleanUsername || !fullName || !password) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: fullName.trim(),
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Guarantee profile insertion directly in Supabase
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: cleanUsername,
          full_name: fullName.trim(),
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        });

        const profile = await fetchProfile(data.user.id, cleanEmail);
        setUser(profile);
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao cadastrar no Supabase.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error in supabase.auth.signOut():', e);
    }
    setUser(null);
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedData.fullName ?? user.fullName,
          username: updatedData.username ?? user.username,
          avatar_url: updatedData.avatarUrl ?? user.avatarUrl,
          bio: updatedData.bio ?? user.bio,
          website: updatedData.website ?? user.website,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in Supabase:', error);
      } else {
        setUser({ ...user, ...updatedData });
      }
    } catch (e) {
      console.error('Unexpected error updating profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
