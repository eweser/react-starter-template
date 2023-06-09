import type { DBEvent } from '@eweser/db';
import { Database } from '@eweser/db';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { WEB_RTC_PEERS, initialRoomConnect } from './config';

const db = new Database({
  // set `debug` to true to see debug messages in the console
  // debug: true,
  // use this to sync webRTC locally with the test-rpc-server started with `npm run start-test-rpc-server`
  webRTCPeers: WEB_RTC_PEERS,
});

export type LoadingStatus =
  | 'initial'
  | 'loading' // only called during load from localStorage
  | 'ready' // when either load or login is complete and at least the local db is ready to use (but remote might not be connected yet)
  | 'signingIn'
  | 'failed';

export interface DatabaseContextValue {
  db: Database;
  loadingStatus: LoadingStatus;
  online: boolean;
  errorMessage: string;
}

export const DatabaseContext = createContext<DatabaseContextValue>({
  db,
  loadingStatus: 'initial',
  online: true,
  errorMessage: '',
});

export const DatabaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('initial');
  const [online, setOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  // the database can start either through a 'load' (where localStorage credentials have been detected)
  // or a login/signup
  const handleStatusUpdate = useCallback(
    ({ event, message, data }: DBEvent) => {
      // 'started' will be called when the db is ready to use either on load or login
      if (event === 'started') {
        setLoadingStatus('ready');
      } else if (event === 'startFailed') {
        setLoadingStatus('failed');
        if (message === 'unable to load localStore loginInfo') return; // ignore the default error message for local storage store not found
        setErrorMessage(message || data?.raw?.message || 'unknown error');
      } else if (event === 'load') {
        if (message === 'starting load') {
          setErrorMessage('');
          setLoadingStatus('loading');
        }
      } else if (event === 'login') {
        if (message === 'starting login') {
          setErrorMessage('');
          if (db.loginStatus !== 'loading') {
            // Because 'load' also calls login, ignore if already loading
            setLoadingStatus('signingIn');
          }
        }
      } else if (event === 'signup') {
        if (message === 'starting signup') {
          setErrorMessage('');
          if (db.loginStatus !== 'loading') {
            setLoadingStatus('signingIn');
          }
        }
      } else if (event === `onlineChange`) {
        setOnline(data?.online ?? false);
      }
    },
    [setLoadingStatus, setErrorMessage, setOnline]
  );

  useEffect(() => {
    db.on('status-update', handleStatusUpdate);
    db.load([initialRoomConnect]);

    return () => {
      db.off('status-update');
    };
  }, [handleStatusUpdate]);

  return (
    <DatabaseContext.Provider
      value={{ db, loadingStatus, online, errorMessage }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
