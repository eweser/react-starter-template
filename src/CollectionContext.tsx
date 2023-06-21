import type { RoomMetaData, Document, Room, CollectionKey } from '@eweser/db';
import { useDatabase } from './DatabaseContext';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface CollectionContextValue<T extends Document> {
  roomsList: {
    [roomAlias: string]: RoomMetaData | undefined;
  };
  connectedRooms: {
    [aliasSeed: string]: Room<T>;
  };
  loadingRoom: string | null;
  roomError: string;
  creatingRoom: boolean;
  handleCreateRoom: (
    name: string,
    initialValues?: Partial<T>[]
  ) => Promise<Room<T> | undefined>;
  handleConnectRoom: (aliasSeed: string) => void;
  handleDeleteRoom: (aliasSeed: string) => Promise<void>;
}

export const makeCollectionProvider = <T extends Document>() => {
  const context = createContext<CollectionContextValue<T>>({
    roomsList: {},
    connectedRooms: {},
    loadingRoom: null,
    roomError: '',
    creatingRoom: false,
    handleCreateRoom: async () => undefined,
    handleConnectRoom: () => undefined,
    handleDeleteRoom: () => Promise.resolve(),
  });

  const Provider = ({
    collectionKey,
    aliasSeed,
    children,
  }: {
    collectionKey: CollectionKey;
    /** an initial room to connect */
    aliasSeed?: string;
    children: React.ReactNode;
  }) => {
    const { db } = useDatabase();
    const [connectedRooms, setConnectedRooms] = useState<{
      [aliasSeed: string]: Room<T>;
    }>({});
    const roomsList = db.getCollectionRegistry(collectionKey);

    // allow creating new rooms.
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState<string | null>(null);
    const [roomError, setRoomError] = useState('');

    const handleConnectRoom = useCallback(
      async (aliasSeed: string) => {
        try {
          setLoadingRoom(aliasSeed);
          const onlineRoom = await db.loadAndConnectRoom<T>(
            { collectionKey, aliasSeed },
            (offlineRoom) => {
              setConnectedRooms((prev) => ({
                ...prev,
                [aliasSeed]: offlineRoom,
              }));
            }
          );
          setConnectedRooms((prev) => ({ ...prev, [aliasSeed]: onlineRoom }));
        } catch (error: any) {
          setRoomError(error.message);
        } finally {
          setLoadingRoom(null);
        }
      },
      [collectionKey, db]
    );

    const handleCreateRoom = useCallback(
      async (name: string, initialValues?: Partial<any>[]) => {
        try {
          setRoomError('');
          setCreatingRoom(true);
          const seed = name.toLowerCase().trim().replaceAll(' ', '-');
          const room = await db.createAndConnectRoom<T>({
            collectionKey,
            aliasSeed: seed,
            name,
            // can add a topic if you wish
            topic: '',
            initialValues,
          });
          handleConnectRoom(seed);
          return room;
        } catch (error: any) {
          setRoomError(error.message);
        } finally {
          setCreatingRoom(false);
        }
      },
      [collectionKey, db, handleConnectRoom]
    );

    const handleDeleteRoom = useCallback(
      async (aliasSeed: string) => {
        try {
          confirm('Are you sure you want to delete this folder?');
          await db.deleteRoom({ collectionKey, aliasSeed });
          setConnectedRooms((prev) => {
            const newConnectedRooms = { ...prev };
            delete newConnectedRooms[aliasSeed];
            return newConnectedRooms;
          });
        } catch (error: any) {
          alert(error.message);
        }
      },
      [collectionKey, db]
    );

    useEffect(() => {
      if (aliasSeed && !loadingRoom && !connectedRooms[aliasSeed]) {
        {
          if (!roomsList[aliasSeed]) {
            handleCreateRoom(aliasSeed);
          } else {
            handleConnectRoom(aliasSeed);
          }
        }
      }
    }, [
      connectedRooms,
      handleConnectRoom,
      aliasSeed,
      loadingRoom,
      roomsList,
      handleCreateRoom,
    ]);

    return (
      <context.Provider
        value={{
          roomsList,
          connectedRooms,
          loadingRoom,
          roomError,
          creatingRoom,
          handleCreateRoom,
          handleConnectRoom,
          handleDeleteRoom,
        }}
      >
        {children}
      </context.Provider>
    );
  };
  return { Provider, context };
};

export const useCollection = <T extends Document = Document>(
  context: React.Context<CollectionContextValue<Document>>
): CollectionContextValue<T> => {
  const contextWrapped = useContext(context);
  if (!contextWrapped) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return contextWrapped;
};
