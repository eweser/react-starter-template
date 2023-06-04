import {
  getAliasSeedFromAlias,
  type Documents,
  type Note,
  type Room,
} from '@eweser/db';
import { Box, Button, CircularProgress, Divider } from '@mui/material';
import { useState } from 'react';
import { useCollection } from '../CollectionContext';
import { useDatabase } from '../DatabaseContext';
import { NotePreview } from './NotePreview';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { H6 } from './library/Typography';
import { Add } from '@mui/icons-material';

const defaultNoteText = 'New Note';

/** An accordion display of Rooms, each with a list of notes previews */
export const Roomslist = ({
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
        <PreviewList
          room={connectedRooms[aliasSeed]}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
        />
      )}
    </Accordion>
  );
};

const PreviewList = ({
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
