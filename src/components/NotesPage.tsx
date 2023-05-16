import { Container, Paper } from '@mui/material';
import { H1 } from './library/Typography';
import { useCollection } from '../CollectionContext';
import type { Documents, Note, Room } from '@eweser/db';
import { useDatabase } from '../DatabaseContext';
import { useState } from 'react';

export const NotesPage = () => {
  const { currentRoom } = useCollection<Note>();

  if (!currentRoom) return null;
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 2, mb: 2 }}>
        <H1>Notes</H1>
      </Paper>
      <NotesInner currentRoom={currentRoom} />
    </Container>
  );
};

const NotesInner = ({ currentRoom }: { currentRoom: Room<Note> }) => {
  const { db } = useDatabase();

  const Notes = db.getDocuments<Note>(currentRoom);

  const [notes, setNotes] = useState<Documents<Note>>(
    Notes.sortByRecent(Notes.getUndeleted())
  );

  const [selectedNote, setSelectedNote] = useState(notes[0]?._id);

  // listen for changes to the ydoc and update the state
  Notes.onChange((_event) => {
    const unDeleted = Notes.sortByRecent(Notes.getUndeleted());
    setNotes(unDeleted);
    if (!notes[selectedNote] || notes[selectedNote]._deleted) {
      setSelectedNote(Object.keys(unDeleted)[0]);
    }
  });

  const createNote = () => {
    const newNote = Notes.new({ text: 'New Note Body' });
    setSelectedNote(newNote._id);
  };

  const updateNoteText = (text: string, note?: Note) => {
    if (!note) return;
    note.text = text;
    Notes.set(note);
  };

  const deleteNote = (note: Note) => {
    Notes.delete(note._id);
  };

  return (
    <Container maxWidth="md">
      {Object.keys(notes).map((id) => {
        const note = notes[id];
        if (note && !notes[id]?._deleted)
          return (
            <div onClick={() => setSelectedNote(note._id)} key={note._id}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note);
                }}
              >
                X
              </button>
              {note.text}
            </div>
          );
      })}{' '}
    </Container>
  );
};
