import type { Note, Room, Documents } from '@eweser/db';
import { CollectionKey, getAliasSeedFromAlias } from '@eweser/db';
import { useState, useCallback } from 'react';
import { makeCollectionProvider, useCollection } from './CollectionContext';
import { useDatabase } from './DatabaseContext';
import { defaultNoteText } from './config';
const { Provider, context } = makeCollectionProvider();

export const NotesProvider = ({
  aliasSeed,
  children,
}: {
  aliasSeed?: string;
  children: React.ReactNode;
}) => (
  <Provider collectionKey={CollectionKey.notes} aliasSeed={aliasSeed}>
    {children}
  </Provider>
);

export const useNotesCollections = () => useCollection<Note>(context);

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
