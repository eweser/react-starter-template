import type { Note, Room, Documents } from '@eweser/db';
import { CollectionKey, getAliasSeedFromAlias } from '@eweser/db';
import { useState, useCallback } from 'react';
import { CollectionProvider, useCollection } from './CollectionContext';
import { useDatabase } from './DatabaseContext';
import { defaultNoteText } from './config';

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

export const useNotesCollections = () => useCollection<Note>();

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
