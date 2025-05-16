import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import { Container, Paper, Typography, Box } from '@mui/material';
import { themeColors } from '../theme';
import backgroundImage from '../assets/Main/main3.png';
import Logo from '../components/common/Logo';

const SignupPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 77, 64, 0.7), rgba(0, 77, 64, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              color: 'white',
              textAlign: { xs: 'center', md: 'left' },
              flex: 1,
              maxWidth: { md: '500px' },
            }}
          >
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Logo color="white"/>
            </Box>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Start Your Journey
            </Typography>
            <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
              Join NutriWise today and transform your health and fitness
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Get personalized meal plans and expert
              guidance to achieve your health goals.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: { md: '500px' },
              width: '100%',
            }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}
              >
                Create Account
              </Typography>
              <AuthForm mode="signup"/>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
