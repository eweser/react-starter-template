import { getAliasSeedFromAlias } from '@eweser/db';
import type { DialogProps } from '@mui/material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNotes } from '../CollectionContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { H6 } from './library/Typography';
import { NotePreviewList } from './NotePreviewList';
import { useDatabase } from '../DatabaseContext';
import { defaultNoteText } from '../config';
import CloseIcon from '@mui/icons-material/Close';
import {
  DeleteOutline,
  Edit,
  MoreHorizRounded,
  Share,
} from '@mui/icons-material';
interface CreateRoomModalProps extends Omit<DialogProps, 'children'> {
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  creatingRoom: boolean;
  handleCreateRoom: () => void;
  onClose: () => void;
}

const CreateRoomModal = ({
  newRoomName,
  setNewRoomName,
  handleCreateRoom,
  creatingRoom,

  ...props
}: CreateRoomModalProps) => {
  return (
    <Dialog {...props}>
      <Box sx={{ p: 3, width: 400 }}>
        <DialogTitle>
          Create a new folder
          {props.onClose && (
            <IconButton
              aria-label="close"
              onClick={props.onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="New Folder Name"
            variant="filled"
            value={newRoomName}
            fullWidth
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateRoom} variant="contained">
            {creatingRoom ? <CircularProgress size={25} /> : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

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
  const { roomsList, handleCreateRoom } = useNotes();
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
  const { db } = useDatabase();
  const { connectedRooms, handleConnectRoom, handleDeleteRoom, loadingRoom } =
    useNotes();

  const [expanded, setExpanded] = useState(
    selectedNote.roomAliasSeed === aliasSeed
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const roomMenuOpen = Boolean(anchorEl);
  const handleRoomMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRoomMenuClose = () => {
    setAnchorEl(null);
  };

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
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography
          variant="subtitle2"
          sx={{
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {roomName && !roomName.includes(':') ? roomName : aliasSeed}
          <div>
            {expanded && db.online && loadingRoom === aliasSeed ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <IconButton>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    roomMenuOpen
                      ? handleRoomMenuClose()
                      : handleRoomMenuOpen(e);
                  }}
                  aria-controls={roomMenuOpen ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={roomMenuOpen ? 'true' : undefined}
                  id={`room-menu-${aliasSeed}`}
                >
                  <MoreHorizRounded />
                  {
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      onClose={handleRoomMenuClose}
                      MenuListProps={{
                        'aria-labelledby': `room-menu-${aliasSeed}`,
                      }}
                      open={roomMenuOpen}
                    >
                      <MenuItem
                        onClick={() => {
                          handleRoomMenuClose();
                          handleDeleteRoom(aliasSeed);
                        }}
                      >
                        <DeleteOutline sx={{ mr: 2 }} fontSize={'small'} />
                        Delete
                      </MenuItem>
                      <MenuItem disabled onClick={handleRoomMenuClose}>
                        <Edit sx={{ mr: 2 }} fontSize={'small'} />
                        Rename
                      </MenuItem>
                      <MenuItem disabled>
                        <Share sx={{ mr: 2 }} fontSize={'small'} />
                        Share
                      </MenuItem>
                    </Menu>
                  }
                </IconButton>
              </>
            )}
          </div>
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
