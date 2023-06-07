import { CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDatabase } from '../DatabaseContext';
import {
  DeleteOutline,
  Edit,
  MoreHorizRounded,
  Share,
} from '@mui/icons-material';
import { useNotesCollections } from '../useNotes';
import { Subtitle2 } from './library/Typography';

export const RoomTitle = ({
  aliasSeed,
  roomName,
  expanded,
}: {
  aliasSeed: string;
  roomName?: string;
  expanded: boolean;
}) => {
  const { db } = useDatabase();
  const { connectedRooms, handleDeleteRoom, loadingRoom } =
    useNotesCollections();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const roomMenuOpen = Boolean(anchorEl);
  const handleRoomMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRoomMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AccordionSummary
      key={connectedRooms[aliasSeed]?.roomAlias ?? aliasSeed}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Subtitle2
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
            <div>
              <IconButton>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  roomMenuOpen ? handleRoomMenuClose() : handleRoomMenuOpen(e);
                }}
                aria-controls={roomMenuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={roomMenuOpen ? 'true' : undefined}
                id={`room-menu-${aliasSeed}`}
              >
                <MoreHorizRounded />

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
              </IconButton>
            </div>
          )}
        </div>
      </Subtitle2>
    </AccordionSummary>
  );
};
