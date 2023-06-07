import { getAliasSeedFromAlias } from '@eweser/db';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { H6 } from './library/Typography';
import { NotePreviewList } from './NotePreviewList';
import { useDatabase } from '../DatabaseContext';
import { defaultNoteText } from '../config';
import { useNotesCollections } from '../useNotes';
import { CreateRoomModal } from './CreateRoomModal';
import { RoomTitle } from './RoomTitle';

/** An accordion display of Rooms, each with a list of notes previews */
export const RoomsList = ({
  setSelectedNote,
  selectedNote,
}: {
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
  const { roomsList, handleCreateRoom } = useNotesCollections();
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateFolder = async () => {
    try {
      setCreatingRoom(true);

      const newRoom = await handleCreateRoom(newRoomName);
      if (!newRoom) throw new Error('Could not create room');
      const Notes = db.getDocuments(newRoom);
      const seed = getAliasSeedFromAlias(newRoom.roomAlias);
      const newNote = Notes.new({ text: defaultNoteText });
      setSelectedNote({
        roomAliasSeed: seed,
        id: newNote._id,
      });
      // roomlist is not updating...
      setCreateRoomModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCreatingRoom(false);
      setNewRoomName('');
    }
  };
  return (
    <>
      <Box
        sx={{ display: 'flex', m: 1, p: 1, justifyContent: 'space-between' }}
      >
        <H6>Folders</H6>
        <Button
          onClick={() => setCreateRoomModalOpen(true)}
          variant="outlined"
          color="secondary"
          size="small"
          sx={{
            p: 0,
            fontSize: '0.75rem',
            lineHeight: '1.5rem',
            height: 'fit-content',
          }}
          endIcon={<CreateNewFolderIcon fontSize={'small'} />}
        >
          New
        </Button>
      </Box>
      {Object.values(roomsList).map((roomData) => {
        if (!roomData) return null;
        const { roomAlias, roomName } = roomData;
        const aliasSeed = getAliasSeedFromAlias(roomAlias);
        return (
          <RoomAccordion
            key={aliasSeed}
            aliasSeed={aliasSeed}
            roomName={roomName}
            setSelectedNote={setSelectedNote}
            selectedNote={selectedNote}
          />
        );
      })}
      <CreateRoomModal
        open={createRoomModalOpen}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        creatingRoom={creatingRoom}
        handleCreateRoom={handleCreateFolder}
        onClose={() => setCreateRoomModalOpen(false)}
      />
    </>
  );
};

const RoomAccordion = ({
  aliasSeed,
  roomName,
  setSelectedNote,
  selectedNote,
}: {
  aliasSeed: string;
  roomName?: string;
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
  const { connectedRooms, handleConnectRoom } = useNotesCollections();

  const [expanded, setExpanded] = useState(
    selectedNote.roomAliasSeed === aliasSeed
  );

  const handleAccordionChange = (expand: boolean) => {
    if (expand && !connectedRooms[aliasSeed]) {
      handleConnectRoom(aliasSeed);
    }
    setExpanded(expand);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={(_e, expand) => handleAccordionChange(expand)}
    >
      <RoomTitle
        aliasSeed={aliasSeed}
        roomName={roomName}
        expanded={expanded}
      />
      {connectedRooms[aliasSeed] && (
        <NotePreviewList
          room={connectedRooms[aliasSeed]}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
        />
      )}
    </Accordion>
  );
};
