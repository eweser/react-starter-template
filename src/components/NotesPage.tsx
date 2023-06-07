import { Box, CircularProgress } from '@mui/material';

import { useState } from 'react';
import Editor from './Editor';
import { RoomsList } from './RoomsList';
import { initialRoomConnect } from '../config';
import { useNotesCollections } from '../useNotes';

// needs a room provider for each list of previews, and for the editor.
// the parent state should have selected room, and selected note

export const NotesPage = () => {
  const { connectedRooms } = useNotesCollections();

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
        <RoomsList
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
          placeholder="Select or Create a Note to Begin"
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
