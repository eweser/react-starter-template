import type { RoomMetaData, Document, Room, Note, Documents } from '@eweser/db';
import { CollectionKey, getAliasSeedFromAlias } from '@eweser/db';
import { useDatabase } from './DatabaseContext';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { defaultNoteText } from './config';

export interface CollectionContextValue<T extends Document = Document> {
  roomsList: {
    [roomAlias: string]: RoomMetaData | undefined;
  };
  connectedRooms: {
    [aliasSeed: string]: Room<T>;
  };
  loadingRoom: string | null;
  roomError: string;
  creatingRoom: boolean;
  handleCreateRoom: (name: string) => Promise<Room<T> | undefined>;
  handleConnectRoom: (aliasSeed: string) => void;
  handleDeleteRoom: (aliasSeed: string) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextValue>({
  roomsList: {},
  connectedRooms: {},
  loadingRoom: null,
  roomError: '',
  creatingRoom: false,
  handleCreateRoom: async () => undefined,
  handleConnectRoom: () => undefined,
  handleDeleteRoom: () => Promise.resolve(),
});

export const CollectionProvider = <T extends Document>({
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
  // list out all of the notes rooms in the registry.
  const roomsList = db.getCollectionRegistry(collectionKey);
  const [connectedRooms, setConnectedRooms] = useState<{
    [aliasSeed: string]: Room<T>;
  }>({});

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
    async (name: string) => {
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
    <CollectionContext.Provider
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

export const NotesProvider = ({
  aliasSeed,
  children,
}: {
  aliasSeed?: string;
  children: React.ReactNode;
}) => (
  <CollectionProvider collectionKey={CollectionKey.notes} aliasSeed={aliasSeed}>
    {children}
  </CollectionProvider>
);

export const useNotes = () => useCollection<Note>();

export const useNotesDocuments = (room: Room<Note>) => {
  const { db } = useDatabase();
  const Notes = db.getDocuments(room);

  const [notes, setNotes] = useState<Documents<Note>>(
    Notes.sortByRecent(Notes.getUndeleted())
  );
  const aliasSeed = getAliasSeedFromAlias(room.roomAlias);

  Notes.onChange((_event) => {
    const unDeleted = Notes.sortByRecent(Notes.getUndeleted());
    setNotes(unDeleted);
  });

  const createNote = useCallback(() => {
    return Notes.new({ text: defaultNoteText });
  }, [Notes]);

  const deleteNote = useCallback(
    (note: Note) => {
      return Notes.delete(note._id);
    },
    [Notes]
  );

  const updateNote = useCallback(
    (noteId: string, text: string) => {
      const note = Notes.get(noteId);
      if (!note || !text) return;
      note.text = text;
      Notes.set(note);
    },
    [Notes]
  );

  return {
    notes,
    aliasSeed,
    createNote,
    deleteNote,
    updateNote,
  };
};
