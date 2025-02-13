import { createContext, ReactNode, useEffect, useState } from 'react'

import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storeUser';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  singOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function singIn(email: string, password: string) {
    try {
      const {data} = await api.post('/sessions', { email, password });

      if (data.user)
        setUser(data.user);
        storageUserSave(data.user);
    }
    catch(error){
      throw error;
    }
  }

async function singOut(){
  try {
    setIsLoadingUserStorageData(true);
    setUser({} as UserDTO);

    await storageUserRemove();
  } catch (error) {
    throw error;
  }
  finally{
    setIsLoadingUserStorageData(false);
  }
}

  async function loadUserDate(){
    try {
      const userLogged = await storageUserGet();

      if (userLogged){
        setUser(userLogged);
      }  
    } catch (error) {
      throw error;
    }
    finally{
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserDate();
  },[]);

  return (
    <AuthContext.Provider value={{ user, singIn, singOut, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  );
}