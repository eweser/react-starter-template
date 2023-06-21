import type { DialogProps } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  Box,
  IconButton,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { H5, Overline } from './library/Typography';
import { defaultProfileId, useProfiles } from '../useProfile';
import { useCallback, useState } from 'react';

interface CreateRoomModalProps extends Omit<DialogProps, 'children'> {
  onClose: () => void;
}

export const AccountModal = ({ ...props }: CreateRoomModalProps) => {
  const {
    publicProfile,
    privateProfile,
    appProfile,
    updatePublicProfile,
    updatePrivateProfile,
    updateAppProfile,
  } = useProfiles();
  const firstName = publicProfile?.firstName ?? privateProfile?.firstName ?? '';
  const [newFirstName, setNewFirstName] = useState(firstName);
  const firstNameIsPublic = !!publicProfile?.firstName;

  const lastName = publicProfile?.lastName ?? privateProfile?.lastName ?? '';
  const [newLastName, setNewLastName] = useState(lastName);
  const lastNameIsPublic = !!publicProfile?.lastName;

  const [newAlias, setNewAlias] = useState(appProfile?.alias);

  const [edit, setEdit] = useState(false);

  const clearForm = useCallback(() => {
    setNewFirstName(firstName);
    setNewLastName(lastName);
    setNewAlias(appProfile?.alias);
  }, [appProfile?.alias, firstName, lastName]);

  const handleSave = useCallback(() => {
    // This is a bit messy. Open to suggestions on how to clean it up.
    // The issue is that public and private can only be on the 'room' level. Usually a folder or collection of things can be set together,
    // but to make a unified profile that has public and private parts is a bit hairy.
    if (newFirstName && newFirstName !== firstName) {
      firstNameIsPublic
        ? updatePublicProfile({
            firstName: newFirstName,
            _id: defaultProfileId,
          })
        : updatePrivateProfile({
            firstName: newFirstName,
            _id: defaultProfileId,
          });
    }
    if (newLastName && newLastName !== lastName) {
      lastNameIsPublic
        ? updatePublicProfile({ lastName: newLastName, _id: defaultProfileId })
        : updatePrivateProfile({
            lastName: newLastName,
            _id: defaultProfileId,
          });
    }
    if (newAlias && newAlias !== appProfile?.alias) {
      updateAppProfile({ alias: newAlias, _id: defaultProfileId });
    }
    setEdit(false);
  }, [
    appProfile?.alias,
    firstName,
    firstNameIsPublic,
    lastName,
    lastNameIsPublic,
    newAlias,
    newFirstName,
    newLastName,
    updateAppProfile,
    updatePrivateProfile,
    updatePublicProfile,
  ]);

  return (
    <Dialog {...props}>
      <Box sx={{ p: 3, width: 400 }}>
        <DialogTitle>
          <Box sx={{ fontSize: 36 }}>Profile</Box>
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
        <DialogContent
          sx={{ rowGap: 2, display: 'flex', flexDirection: 'column' }}
        >
          <Box>
            {edit ? (
              <TextField
                label="First Name"
                variant="filled"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
            ) : (
              <>
                <Overline color="textSecondary">First Name</Overline>
                <H5>
                  {firstName}{' '}
                  <Chip label={firstNameIsPublic ? 'public' : 'private'} />
                </H5>
              </>
            )}
          </Box>
          <Box>
            {edit ? (
              <TextField
                label="First Name"
                variant="filled"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            ) : (
              <>
                <Overline color="textSecondary">Last Name</Overline>
                <H5>
                  {lastName}{' '}
                  <Chip label={lastNameIsPublic ? 'public' : 'private'} />
                </H5>
              </>
            )}
          </Box>
          <Box>
            {edit ? (
              <TextField
                label="In-App Display Name"
                variant="filled"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
              />
            ) : (
              <>
                <Overline color="textSecondary">In-App Display Name</Overline>
                <H5>{appProfile?.alias}</H5>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {edit ? (
            <>
              <Button
                onClick={() => {
                  setEdit(false);
                  clearForm();
                }}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                clearForm();
                setEdit(true);
              }}
              variant="contained"
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
