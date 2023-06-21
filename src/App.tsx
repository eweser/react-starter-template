import { Box, CircularProgress, useTheme } from '@mui/material';
import { Nav } from './components/Nav';
import { useDatabase } from './DatabaseContext';
import { LoginForm } from './components/LoginForm';
import { NotesProvider } from './useNotes';
import { initialRoomConnect } from './config';
import { NotesPage } from './components/NotesPage';
import { ProfilesProvider } from './useProfile';
import { AccountModal } from './components/AccountModal';
import { useState } from 'react';

function App() {
  const { loadingStatus } = useDatabase();
  const { palette } = useTheme();
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  return (
    <Box
      className="flex-grow-container"
      sx={{
        pt: 5,
        backgroundColor: palette.background.default,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Nav setAccountModalOpen={setAccountModalOpen} />
      {loadingStatus === 'initial' || loadingStatus === 'loading' ? (
        <CircularProgress size={80} />
      ) : loadingStatus === 'ready' ? (
        <NotesProvider aliasSeed={initialRoomConnect.aliasSeed}>
          <ProfilesProvider aliasSeed="public">
            <NotesPage />
            <AccountModal
              open={accountModalOpen}
              onClose={() => setAccountModalOpen(false)}
            />
          </ProfilesProvider>
        </NotesProvider>
      ) : (
        <LoginForm />
      )}
    </Box>
  );
}

export default App;
