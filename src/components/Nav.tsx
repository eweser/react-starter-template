import {
  AppBar,
  Drawer,
  IconButton,
  ListItem,
  Toolbar,
  List,
  Button,
} from '@mui/material';
import { ThemeToggleButton } from '../ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export const Nav = ({
  setAccountModalOpen,
}: {
  setAccountModalOpen: (open: boolean) => void;
}) => {
  const [navOpen, setNavOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem('ewe_loginData');
    window.location.reload();
  };
  return (
    <>
      <AppBar position="fixed" enableColorOnDark>
        <Toolbar style={{ minHeight: 0 }} sx={{ p: 0.5 }}>
          <IconButton
            size="small"
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
            <Button
              onClick={() => setAccountModalOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                px: 2,
              }}
            >
              <AccountBoxIcon sx={{ mr: 2 }} color="inherit" />
              Account
            </Button>
          </ListItem>
          <ListItem>
            <ThemeToggleButton />
          </ListItem>
          <ListItem>
            <Button
              onClick={handleLogOut}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                px: 2,
              }}
            >
              <LogoutIcon sx={{ mr: 2 }} color="inherit" />
              Log Out
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
