import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { CssBaseline } from '@mui/material';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';
import { themeColors } from './theme';

const HomePage: React.FC = () => (
  <Box sx={{ flexGrow: 1, backgroundColor: themeColors.background, minHeight: '100vh' }}>
    <AppBar position="sticky" sx={{ backgroundColor: themeColors.primary }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: themeColors.appBarText }}>
          NutriWise
        </Typography>
        <Button color="inherit" component={RouterLink} to="/login" sx={{ color: themeColors.appBarText }}>Login</Button>
        <Button color="inherit" component={RouterLink} to="/signup" sx={{ color: themeColors.appBarText }}>Sign Up</Button>
      </Toolbar>
    </AppBar>

    <Box
      sx={{
        pt: 12,
        pb: 10,
        textAlign: 'center',
        backgroundColor: themeColors.secondary,
        color: themeColors.appBarText,
        // backgroundImage: 'url(/path/to/your/futuristic-hero-image.jpg)',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Unlock Your Best Self with NutriWise
        </Typography>
        <Typography variant="h5" component="p" paragraph sx={{ mb: 5, opacity: 0.9 }}>
          Personalized nutrition and fitness plans designed for your unique goals and needs.
          Achieve sustainable results with science-backed recommendations.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/signup"
          size="large"
          sx={{
            mr: 2,
            backgroundColor: themeColors.accent,
            color: themeColors.textPrimary,
            padding: '10px 30px',
            fontSize: '1.1rem',
            '&:hover': { backgroundColor: '#FFB300' }
          }}
        >
          Get Started Now
        </Button>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: '600', color: themeColors.textPrimary, mb: 6 }}>
        How NutriWise Empowers You
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        {[
          {
            icon: '🍽️',
            title: 'Personalized Meal Plans',
            description: 'Delicious and balanced meal plans tailored to your dietary preferences, calorie needs, and fitness objectives.',
          },
          {
            icon: '🏋️',
            title: 'Custom Workout Routines',
            description: 'Effective workout programs designed for your fitness level, available equipment, and desired outcomes (weight loss, muscle gain, etc.).',
          },
          {
            icon: '📄',
            title: 'Medical Document Integration',
            description: 'Securely upload medical documents to help us adapt recommendations for conditions like diabetes, ensuring your plan is safe and effective.',
          },
          {
            icon: '🛡️',
            title: 'Health-Specific Adaptations',
            description: 'Our system intelligently adjusts your plans based on your provided health information, making your journey both effective and safe.',
          },
        ].map((feature) => (
          <Box key={feature.title} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }, display: 'flex' }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', backgroundColor: themeColors.paperBackground, width: '100%' }}>
              <Box mb={2} fontSize={40}>{feature.icon}</Box>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: '500', color: themeColors.textPrimary }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {feature.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Container>

    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: themeColors.primary, color: themeColors.appBarText, mt: 'auto' }}>
      <Typography variant="body2">&copy; {new Date().getFullYear()} NutriWise. All rights reserved.</Typography>
    </Box>

  </Box>
);

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
