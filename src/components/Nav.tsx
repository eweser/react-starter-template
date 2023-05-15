import {
  AppBar,
  Drawer,
  IconButton,
  ListItem,
  Toolbar,
  List,
} from '@mui/material';
import { ThemeToggleButton } from '../ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export const Nav = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <>
      <AppBar position="fixed" enableColorOnDark>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={navOpen} onClose={() => setNavOpen(false)}>
        <List sx={{ minWidth: 300 }}>
          <ListItem>
            <ThemeToggleButton />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
