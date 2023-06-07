import { Box, CircularProgress, useTheme } from '@mui/material';
import { Nav } from './components/Nav';
import { useDatabase } from './DatabaseContext';
import { LoginForm } from './components/LoginForm';
import { NotesProvider } from './useNotes';
import { initialRoomConnect } from './config';
import { NotesPage } from './components/NotesPage';

function App() {
  const { loadingStatus } = useDatabase();
  const { palette } = useTheme();
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
      <Nav />
      {loadingStatus === 'initial' || loadingStatus === 'loading' ? (
        <CircularProgress size={80} />
      ) : loadingStatus === 'ready' ? (
        <NotesProvider {...initialRoomConnect}>
          <NotesPage />
        </NotesProvider>
      ) : (
        <LoginForm />
      )}
    </Box>
  );
}

export default App;
