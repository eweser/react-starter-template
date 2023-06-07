import type { DialogProps } from '@mui/material';
import {
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CreateRoomModalProps extends Omit<DialogProps, 'children'> {
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  creatingRoom: boolean;
  handleCreateRoom: () => void;
  onClose: () => void;
}

export const CreateRoomModal = ({
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
