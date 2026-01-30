import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService from '@/lib/api';

// User interface
interface User {
  id: string;
  email: string;
  fullName: string;
  clinicName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, clinicName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (profileData: any) => Promise<{ error: any }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication state
    const initAuth = async () => {
      try {
        const token = apiService.getToken();
        
        if (token) {
          const { valid, user: userData } = await apiService.verifyToken();
          
          if (valid && userData) {
            setUser(userData);
          } else {
            apiService.clearToken();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        apiService.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { practitioner: userData, token } = await apiService.login({ email, password });
      
      apiService.setToken(token);
      setUser(userData);
      
      return { error: null };
    } catch (err: any) {
      return { 
        error: { 
          message: err.message || 'Sign in failed',
          name: 'AuthError'
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, clinicName?: string) => {
    try {
      setLoading(true);
      const { practitioner: userData, token } = await apiService.register({
        name: fullName,
        email,
        password,
        clinicName
      });
      
      apiService.setToken(token);
      setUser(userData);
      
      return { error: null };
    } catch (err: any) {
      return { 
        error: { 
          message: err.message || 'Sign up failed',
          name: 'AuthError'
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await apiService.logout();
      apiService.clearToken();
      setUser(null);
      return { error: null };
    } catch (err: any) {
      // Even if logout fails, clear local state
      apiService.clearToken();
      setUser(null);
      return { 
        error: { 
          message: err.message || 'Sign out failed',
          name: 'AuthError'
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const { user: updatedUser } = await apiService.updateProfile(profileData);
      setUser(updatedUser);
      return { error: null };
    } catch (err: any) {
      return { 
        error: { 
          message: err.message || 'Profile update failed',
          name: 'ProfileError'
        }
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiService.changePassword({ currentPassword, newPassword });
      return { error: null };
    } catch (err: any) {
      return { 
        error: { 
          message: err.message || 'Password change failed',
          name: 'PasswordError'
        }
      };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    isAuthenticated: !!user && user.isActive
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}