import {
  Box,
  CircularProgress,
  Container,
  Paper,
  useTheme,
} from '@mui/material';
import { H1 } from './components/library/Typography';
import { Nav } from './components/Nav';
import { useDatabase } from './DatabaseContext';
import { LoginForm } from './components/LoginForm';

export const NotesPage = () => {
  return (
    <Container maxWidth="md">
      <Paper>
        <H1>Note</H1>
      </Paper>
    </Container>
  );
};

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
        <NotesPage />
      ) : (
        <LoginForm />
      )}
    </Box>
  );
}

export default App;
