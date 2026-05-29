import { createContext, useContext, useState } from 'react';
import { initialUsers } from '../data/users';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('tt_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('tt_registered_users');
    const parsedSaved = savedUsers ? JSON.parse(savedUsers) : [];
    const all = [...initialUsers];
    parsedSaved.forEach(su => {
      if (!all.some(u => u.email.toLowerCase() === su.email.toLowerCase())) {
        all.push(su);
      }
    });
    return all;
  });

  function setUser(userData) {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('tt_current_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('tt_current_user');
    }
  }

  function logout() {
    setUser(null);
  }

  function registerUser(newUser) {
    const exists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Email is already registered' };
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    const savedUsers = localStorage.getItem('tt_registered_users');
    const parsedSaved = savedUsers ? JSON.parse(savedUsers) : [];
    if (!parsedSaved.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      parsedSaved.push(newUser);
      localStorage.setItem('tt_registered_users', JSON.stringify(parsedSaved));
    }

    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, users, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
