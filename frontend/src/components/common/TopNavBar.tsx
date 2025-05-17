import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { themeColors } from '../../theme';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileDialog from '../../pages/ProfileDialog';
import { auth } from '../../services/firebase';
import { getProfile } from '../../services/api';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Generate Plan', to: '/generate' },
  { label: 'Upload Documents', to: '/upload' },
];

interface ProfileData {
  age: number | null;
  sex: string;
  weight: number | null;
  height: number | null;
  activity_level: string;
  fitness_goal: string;
  dietary_preferences: string;
}

const TopNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log("[DEBUG] TopNavBar Auth state changed:", user ? user.uid : 'logged out');
    });

    return () => unsubscribe();
  }, []);

  const email = currentUser?.email || '';

  const getInitials = () => {
    if (!email) return 'U';
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: themeColors.primary,
          color: themeColors.appBarText,
          boxShadow: '0 2px 16px 0 rgba(31,38,135,0.08)',
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 72,
          }}
        >
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Logo color={themeColors.appBarText}/>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={RouterLink}
                to={link.to}
                sx={{
                  fontWeight: 600,
                  color:
                    location.pathname === link.to
                      ? themeColors.accent
                      : themeColors.appBarText,
                  background:
                    location.pathname === link.to
                      ? 'rgba(255,255,255,0.10)'
                      : 'transparent',
                  borderRadius: 2,
                  px: 2.2,
                  py: 0.8,
                  fontSize: 15,
                  transition: 'background 0.18s, color 0.18s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.18)',
                    color: themeColors.accent,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon/>}
              onClick={handleLogout}
              sx={{
                background: themeColors.accent,
                color: themeColors.primary,
                fontWeight: 700,
                borderRadius: 2,
                px: 2.2,
                py: 0.8,
                fontSize: 14,
                boxShadow: 2,
                textTransform: 'none',
                '&:hover': {
                  background: '#FFB300',
                  color: themeColors.primary,
                },
              }}
            >
              Log out
            </Button>
            <IconButton
              size="large"
              sx={{ p: 0 }}
              onClick={() => setProfileOpen(true)}
            >
              <Avatar
                sx={{
                  bgcolor: '#43cea2',
                  color: '#fff',
                  fontWeight: 700,
                  width: 40,
                  height: 40,
                  fontSize: 22,
                }}
              >
                {getInitials()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)}/>
    </>
  );
};

export default TopNavBar;
