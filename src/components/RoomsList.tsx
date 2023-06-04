import { getAliasSeedFromAlias, type Note } from '@eweser/db';
import { Box, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useCollection } from '../CollectionContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { H6 } from './library/Typography';
import { NotePreviewList } from './NotePreviewList';

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
  const { roomsList } = useCollection<Note>();
  return (
    <>
      <Box
        sx={{ display: 'flex', m: 1, p: 1, justifyContent: 'space-between' }}
      >
        <H6>Folders</H6>
        <Button
          variant="outlined"
          color="secondary"
          endIcon={<CreateNewFolderIcon />}
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
  const { connectedRooms, handleConnectRoom, loadingRoom } =
    useCollection<Note>();

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
      <AccordionSummary
        key={connectedRooms[aliasSeed]?.roomAlias ?? aliasSeed}
        expandIcon={
          expanded && loadingRoom === aliasSeed ? (
            <CircularProgress size={20} />
          ) : (
            <ExpandMoreIcon />
          )
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ overflow: 'hidden', maxWidth: 200 }}>
          {roomName && !roomName.includes(':') ? roomName : aliasSeed}
        </Typography>
      </AccordionSummary>
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
