import { type Note, type Room } from '@eweser/db';
import { Button, Divider } from '@mui/material';

import { NotePreview } from './NotePreview';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Add } from '@mui/icons-material';
import { useNotesDocuments } from '../CollectionContext';

export const NotePreviewList = ({
  room,
  setSelectedNote,
  selectedNote,
}: {
  room: Room<Note>;
  selectedNote: {
    roomAliasSeed: string;
    id: string;
  };
  setSelectedNote: ({
    roomAliasSeed,
    id,
  }: {
    roomAliasSeed: string;
    id: string;
  }) => void;
}) => {
  const { notes, createNote, deleteNote, aliasSeed } = useNotesDocuments(room);

  const handleCreateNote = () => {
    const newNote = createNote();
    setSelectedNote({
      roomAliasSeed: aliasSeed,
      id: newNote._id,
    });
  };
  const handleDeleteNote = (note: Note) => {
    deleteNote(note);
    if (selectedNote.id === note._id) {
      const undeleted = Object.values(notes).filter((note) => !note._deleted);
      setSelectedNote({
        roomAliasSeed: aliasSeed,
        id: undeleted[0]?._id || '',
      });
    }
  };

  return (
    <AccordionDetails sx={{ background: 'background.default' }}>
      <Button
        onClick={handleCreateNote}
        color="secondary"
        variant="outlined"
        endIcon={<Add />}
        size="small"
        sx={{
          mb: 1,
          ml: 2,
          p: 0,
          fontSize: '0.75rem',
          lineHeight: '1.5rem',
          height: 'fit-content',
        }}
      >
        New
      </Button>

      {Object.keys(notes).map((id) => {
        const note = notes[id];

        if (note && !notes[id]?._deleted) {
          return (
            <div key={id}>
              <NotePreview
                key={id}
                note={note}
                deleteNote={handleDeleteNote}
                onClick={() =>
                  setSelectedNote({
                    roomAliasSeed: aliasSeed,
                    id,
                  })
                }
              />
              {id !== Object.keys(notes)[Object.keys(notes).length - 1] && (
                <Divider />
              )}
            </div>
          );
        }
      })}
    </AccordionDetails>
  );
};
