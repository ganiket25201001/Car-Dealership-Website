import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  id: '1',
  name: 'Amit Sharma',
  email: 'amit.sharma@hsrmotors.com',
  phone: '+91 98765 43210',
  role: 'Senior Sales Manager',
  department: 'Sales',
  joinDate: '2023-01-15',
  bio: 'Experienced automotive sales professional with 8+ years in the industry. Specialized in luxury vehicle sales and customer relationship management.',
  location: 'Mumbai, Maharashtra',
  timezone: 'Asia/Kolkata',
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    // Try to load user data from localStorage
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  const updateUser = (updates: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}