import { Box, CircularProgress, Divider, Fab } from '@mui/material';
import { useCollection } from '../CollectionContext';
import type { Documents, Note, Room } from '@eweser/db';
import { useDatabase } from '../DatabaseContext';
import { useState } from 'react';
import Editor from './Editor';
import { Add } from '@mui/icons-material';
import { NotePreview } from './NotePreview';

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
    <Box
      className="flex-grow-container"
      sx={{
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          width: {
            xs: '100%',
            sm: 300,
          },
          order: {
            xs: 2,
            sm: 1,
          },
          rowGap: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Object.keys(notes).map((id) => {
          const note = notes[id];

          if (note && !notes[id]?._deleted) {
            return (
              <div key={id}>
                <NotePreview
                  key={id}
                  note={note}
                  deleteNote={deleteNote}
                  onClick={() => setSelectedNote(id)}
                />
                <Divider />
              </div>
            );
          }
        })}
      </Box>
      <Editor
        sx={{
          order: {
            xs: 1,
            sm: 2,
          },
        }}
        handleChange={(text) => updateNoteText(text, notes[selectedNote])}
        placeholder="New Note"
        value={notes[selectedNote]?.text}
      />
      <Fab
        variant="circular"
        sx={{ position: 'fixed', bottom: 16, right: 24 }}
        onClick={() => createNote()}
      >
        <Add />
      </Fab>
    </Box>
  );
};
