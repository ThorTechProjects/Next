import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Switch from '@mui/material/Switch';
import Link from 'next/link'; // Import Link
import { supabase } from '../lib/supabase';  // Import Supabase client

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : 0,
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  background: theme.palette.primary.main,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open
      ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
      : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
  })
);

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
  },
}));

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#5b5b5b',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c60000',
    },
    secondary: {
      main: '#f5f5f5',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
});

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);
  const [user, setUser] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  // Fetch the user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user); // Set the user data
    };

    fetchUser(); // Fetch the user when the component is mounted

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Listen to login and logout events
        if (session?.user) {
          setUser(session.user); // Set the user when logged in
        } else {
          setUser(null); // Set user to null when logged out
        }
      }
    );

    // Cleanup the subscription on unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []); // Empty dependency array to ensure this runs only once on component mount

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Thor Tech
            </Typography>
            <Switch
              checked={darkMode}
              onChange={toggleTheme}
              name="themeToggle"
              color="default"
              sx={{ marginLeft: 'auto' }}
            />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
              {/* Render KLM Filter only for admin users */}
              {user && user.user_metadata.role === 'admin' && (
              <StyledLink href="/month" passHref>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <StyledListItemButton
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      ...(open && { justifyContent: 'initial' }),
                      ...(!open && { justifyContent: 'center' }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        ...(open && { mr: 3 }),
                        ...(!open && { mr: 'auto' }),
                      }}
                    >
                      <AdminPanelSettingsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Select Month" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                  </StyledListItemButton>
                </ListItem>
              </StyledLink>
            )}
            {/* Render KLM Filter only for admin users */}
            {user && user.user_metadata.role === 'admin' && (
              <StyledLink href="/klmfilter" passHref>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <StyledListItemButton
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      ...(open && { justifyContent: 'initial' }),
                      ...(!open && { justifyContent: 'center' }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        ...(open && { mr: 3 }),
                        ...(!open && { mr: 'auto' }),
                      }}
                    >
                      <AdminPanelSettingsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="KLMFilter" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                  </StyledListItemButton>
                </ListItem>
              </StyledLink>
            )}
            {user && (
            <StyledLink href="/klm" passHref>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    ...(open && { justifyContent: 'initial' }),
                    ...(!open && { justifyContent: 'center' }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      ...(open && { mr: 3 }),
                      ...(!open && { mr: 'auto' }),
                    }}
                  >
                    <CloudUploadIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="KLM" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                </StyledListItemButton>
              </ListItem>
            </StyledLink>
            )}
            {!user && (
            <StyledLink href="/signup" passHref>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    ...(open && { justifyContent: 'initial' }),
                    ...(!open && { justifyContent: 'center' }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      ...(open && { mr: 3 }),
                      ...(!open && { mr: 'auto' }),
                    }}
                  >
                    <AddIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Sign up" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                </StyledListItemButton>
              </ListItem>
            </StyledLink>
            )}
            {!user && (
              <StyledLink href="/login" passHref>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <StyledListItemButton
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      ...(open && { justifyContent: 'initial' }),
                      ...(!open && { justifyContent: 'center' }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        ...(open && { mr: 3 }),
                        ...(!open && { mr: 'auto' }),
                      }}
                    >
                      <LoginIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Login" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                  </StyledListItemButton>
                </ListItem>
              </StyledLink>
            )}
            {user && (
              <StyledLink href="/logout" passHref>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <StyledListItemButton
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      ...(open && { justifyContent: 'initial' }),
                      ...(!open && { justifyContent: 'center' }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        ...(open && { mr: 3 }),
                        ...(!open && { mr: 'auto' }),
                      }}
                    >
                      <LogoutIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: theme.palette.text.primary, ...(open ? { opacity: 1 } : { opacity: 0 }) }} />
                  </StyledListItemButton>
                </ListItem>
              </StyledLink>
            )}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', color: 'text.primary' }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}