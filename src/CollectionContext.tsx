import type { CollectionKey, RoomMetaData, Document, Room } from '@eweser/db';
import { useDatabase } from './DatabaseContext';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
export interface CollectionContextValue<T extends Document = Document> {
  roomsList: {
    [roomAlias: string]: RoomMetaData | undefined;
  };
  currentRoom: Room<T> | null;
  loadingRoom: boolean;
  roomError: string;
  creatingRoom: boolean;
  handleCreateRoom: (name: string) => void;
  handleSelectRoom: (aliasSeed: string) => void;
}

const CollectionContext = createContext<CollectionContextValue>({
  roomsList: {},
  currentRoom: null,
  loadingRoom: false,
  roomError: '',
  creatingRoom: false,
  handleCreateRoom: () => null,
  handleSelectRoom: () => null,
});

export const CollectionProvider = <T extends Document>({
  collectionKey,
  aliasSeed,
  children,
}: {
  collectionKey: CollectionKey;
  aliasSeed?: string;
  children: React.ReactNode;
}) => {
  const { db } = useDatabase();
  // list out all of the notes rooms in the registry.
  const roomsList = db.getCollectionRegistry(collectionKey);
  // allow the user to select one to connect to
  // Pass the current room down to the NotesInternal component
  const [currentRoom, setCurrentRoom] = useState<Room<T> | null>(null);
  // allow creating new rooms.
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [roomError, setRoomError] = useState('');

  const handleCreateRoom = async (name: string) => {
    try {
      setRoomError('');
      setCreatingRoom(true);
      const seed = name.toLowerCase();
      await db.createAndConnectRoom<T>({
        collectionKey,
        aliasSeed: seed,
        name,
        // can add a topic if you wish
        topic: '',
      });
      handleSelectRoom(seed);
    } catch (error: any) {
      setRoomError(error.message);
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSelectRoom = useCallback(
    async (aliasSeed: string) => {
      try {
        setCurrentRoom(null);
        setLoadingRoom(true);
        const onlineRoom = await db.loadAndConnectRoom<T>(
          { collectionKey, aliasSeed },
          (offlineRoom) => setCurrentRoom(offlineRoom)
        );
        setCurrentRoom(onlineRoom);
      } catch (error: any) {
        setRoomError(error.message);
      } finally {
        setLoadingRoom(false);
      }
    },
    [collectionKey, db]
  );

  useEffect(() => {
    if (aliasSeed && !loadingRoom && !currentRoom) {
      handleSelectRoom(aliasSeed);
    }
  }, [currentRoom, handleSelectRoom, aliasSeed, loadingRoom]);

  return (
    <CollectionContext.Provider
      value={{
        roomsList,
        currentRoom,
        loadingRoom,
        roomError,
        creatingRoom,
        handleCreateRoom,
        handleSelectRoom,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = <
  T extends Document = Document
>(): CollectionContextValue<T> => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context as CollectionContextValue<T>;
};
