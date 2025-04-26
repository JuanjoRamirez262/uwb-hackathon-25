import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextType {
  isPatient: boolean;
  setIsPatient: (value: boolean) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [isPatient, setIsPatient] = useState(false);

  return (
    <UserRoleContext.Provider value={{ isPatient, setIsPatient }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};