import { Box, CircularProgress } from '@mui/material';
import { useCollection } from '../CollectionContext';
import type { Note } from '@eweser/db';
import { useState } from 'react';
import Editor from './Editor';
import { Roomslist } from './RoomsList';
import { initialRoomConnect } from '../config';

// needs a room provider for each list of previews, and for the editor.
// the parent state should have selected room, and selected note

export const NotesPage = () => {
  const { connectedRooms } = useCollection<Note>();

  const [selectedNote, setSelectedNote] = useState({
    roomAliasSeed: initialRoomConnect.aliasSeed,
    id: '',
  });

  if (Object.keys(connectedRooms).length === 0) return <CircularProgress />;
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Roomslist
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />
      </Box>
      {connectedRooms[selectedNote.roomAliasSeed] ? (
        <Editor
          sx={{
            order: {
              xs: 1,
              sm: 2,
            },
          }}
          key={selectedNote.roomAliasSeed + selectedNote.id}
          room={connectedRooms[selectedNote.roomAliasSeed]}
          placeholder="New Note"
          selectedNoteId={selectedNote.id}
        />
      ) : (
        <CircularProgress
          sx={{
            order: {
              xs: 1,
              sm: 2,
            },
          }}
        />
      )}
    </Box>
  );
};
