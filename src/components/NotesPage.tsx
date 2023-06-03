import { Box, Button, Card, CircularProgress } from '@mui/material';
import { useCollection } from '../CollectionContext';
import type { Documents, Note, Room } from '@eweser/db';
import { useDatabase } from '../DatabaseContext';
import { useState } from 'react';
import Editor from './Editor';

export const NotesPage = () => {
  const { currentRoom } = useCollection<Note>();

  if (!currentRoom?.ydoc) return <CircularProgress />;
  return <NotesInner currentRoom={currentRoom} />;
};

const NotesInner = ({ currentRoom }: { currentRoom: Room<Note> }) => {
  const { db } = useDatabase();
  const Notes = db.getDocuments(currentRoom);

  const [notes, setNotes] = useState<Documents<Note>>(
    Notes.sortByRecent(Notes.getUndeleted())
  );

  const [selectedNote, setSelectedNote] = useState(
    Object.keys(Notes.sortByRecent(Notes.getUndeleted()))[0]
  );

  // listen for changes to the ydoc and update the state
  Notes.onChange((_event) => {
    const unDeleted = Notes.sortByRecent(Notes.getUndeleted());
    setNotes(unDeleted);
    if (!unDeleted[selectedNote]) {
      setSelectedNote(Object.keys(unDeleted)[0]);
    }
  });

  const createNote = () => {
    // Notes.new will fill in the metadata for you, including _id with a random string and _updated with the current timestamp
    const newNote = Notes.new({ text: 'New Note Body' });
    setSelectedNote(newNote._id);
  };

  const updateNoteText = (text: string, note?: Note) => {
    if (!note) return;
    note.text = text;
    // Notes.set will update _updated with the current timestamp
    Notes.set(note);
  };

  const deleteNote = (note: Note) => {
    Notes.delete(note._id);
  };

  return (
    <Box className="flex-grow-container">
      <Box sx={{ width: 300 }}>
        <Button variant="contained" onClick={() => createNote()}>
          New note
        </Button>

        {Object.keys(notes).map((id) => {
          const note = notes[id];
          if (note && !notes[id]?._deleted)
            return (
              <Card onClick={() => setSelectedNote(note._id)} key={note._id}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note);
                  }}
                >
                  X
                </Button>
                {note.text}
              </Card>
            );
        })}
      </Box>
      <Editor
        handleChange={(text) => updateNoteText(text, notes[selectedNote])}
        placeholder="New Note"
        value={notes[selectedNote]?.text}
      />
    </Box>
  );
};
