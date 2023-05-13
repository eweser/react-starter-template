import { Box, Paper } from '@mui/material';
import { H1 } from './components/library/Typography';
import { Nav } from './components/Nav';

function App() {
  return (
    <Box sx={{ display: 'flex', flex: 1, pt: 6 }}>
      <Nav />
      <Box sx={{ alignSelf: 'center', margin: 'auto' }}>
        <Paper>
          <H1>Hello MUI</H1>
        </Paper>
      </Box>
    </Box>
  );
}

export default App;
