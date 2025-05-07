import { createContext, ReactNode, useEffect, useState } from 'react'

import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storeUser';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuthToken';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
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

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string){
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);  
    } catch (error) {
      throw error; 
    }
    finally{
      setIsLoadingUserStorageData(false);
    }
  }

  async function singIn(email: string, password: string) {
    try {
      const {data} = await api.post('/sessions', { email, password });

      if (data.user && data.token)
      {
          await storageUserAndTokenSave(data.user, data.token);

          userAndTokenUpdate(data.user, data.token);
      }
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
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    }
    finally{
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO){
    try {
      setUser(userUpdated);

      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserDate(){
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (token && userLogged)
        userAndTokenUpdate(userLogged, token);
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
    <AuthContext.Provider value={{ user, singIn, singOut, updateUserProfile, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  );
}