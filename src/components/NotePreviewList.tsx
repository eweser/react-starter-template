import {
  getAliasSeedFromAlias,
  type Documents,
  type Note,
  type Room,
} from '@eweser/db';
import { Button, Divider } from '@mui/material';
import { useState } from 'react';
import { useDatabase } from '../DatabaseContext';
import { NotePreview } from './NotePreview';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Add } from '@mui/icons-material';
import { defaultNoteText } from '../config';

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
  const { db } = useDatabase();
  const Notes = db.getDocuments(room);

  // preview list
  const [notes, setNotes] = useState<Documents<Note>>(
    Notes.sortByRecent(Notes.getUndeleted())
  );
  const aliasSeed = getAliasSeedFromAlias(room.roomAlias);

  Notes.onChange((_event) => {
    const unDeleted = Notes.sortByRecent(Notes.getUndeleted());
    setNotes(unDeleted);
    if (!unDeleted[selectedNote.id]) {
      setSelectedNote({
        roomAliasSeed: aliasSeed,
        id: Object.keys(unDeleted)[0],
      });
    }
  });

  const createNote = () => {
    // Notes.new will fill in the metadata for you, including _id with a random string and _updated with the current timestamp
    const newNote = Notes.new({ text: defaultNoteText });
    setSelectedNote({
      roomAliasSeed: aliasSeed,
      id: newNote._id,
    });
  };
  const deleteNote = (note: Note) => {
    Notes.delete(note._id);
  };
  return (
    <AccordionDetails>
      <Button
        onClick={createNote}
        color="secondary"
        variant="outlined"
        endIcon={<Add />}
        size="small"
        sx={{
          mb: 1,
          alignSelf: 'flex-end',
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
                deleteNote={deleteNote}
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
