import type { DBEvent } from '@eweser/db';
import { Database } from '@eweser/db';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const db = new Database({
  //
  //  debug: true
});

export type LoadingStatus =
  | 'initial'
  | 'loading'
  | 'ready'
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
          setLoadingStatus('signingIn');
        }
      } else if (event === 'signup') {
        if (message === 'starting signup') {
          setErrorMessage('');
          setLoadingStatus('signingIn');
        }
      } else if (event === `onlineChange`) {
        setOnline(data?.online ?? false);
      }
    },
    [setLoadingStatus, setErrorMessage, setOnline]
  );

  useEffect(() => {
    db.on('status-update', handleStatusUpdate);
    db.load([]);

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

export const useDatabase = () => useContext(DatabaseContext);
