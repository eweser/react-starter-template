import { Box, CircularProgress, useTheme } from '@mui/material';
import { Nav } from './components/Nav';
import { useDatabase } from './DatabaseContext';
import { LoginForm } from './components/LoginForm';
import { CollectionProvider } from './CollectionContext';
import { initialRoomConnect } from './config';
import { NotesPage } from './components/NotesPage';

function App() {
  const { loadingStatus } = useDatabase();
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        pt: 6,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.background.default,
      }}
    >
      <Nav />
      {loadingStatus === 'initial' || loadingStatus === 'loading' ? (
        <CircularProgress size={80} />
      ) : loadingStatus === 'ready' ? (
        <CollectionProvider {...initialRoomConnect}>
          <NotesPage />
        </CollectionProvider>
      ) : (
        <LoginForm />
      )}
    </Box>
  );
}

export default App;
