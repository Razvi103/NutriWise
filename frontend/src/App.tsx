import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import {
  DashboardHome,
  GeneratePlanPage,
  UploadDocumentsPage,
} from './pages/DashboardPage';
import { CssBaseline } from '@mui/material';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { themeColors } from './theme';
import FlipCard from './components/home/FlipCard';
import Logo from './components/common/Logo';
import TopNavBar from './components/common/TopNavBar';

import mainImage from './assets/Main/main.png';
import main2Image from './assets/Main/main2.png';
import main3Image from './assets/Main/main3.png';
import main4Image from './assets/Main/main4.png';
import medicalImage from './assets/Medical/Medical.png';
import imageAvif from './assets/Workout/image.avif';
import backgroundImage from './assets/Main/remove_watermark_image_20250514_105621.png';

const HomePage: React.FC = () => (
  <Box
    sx={{
      flexGrow: 1,
      backgroundColor: themeColors.background,
      minHeight: '100vh',
    }}
  >
    <AppBar position="sticky" sx={{ backgroundColor: themeColors.primary }}>
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', flexGrow: 1 }}
        >
          <Logo color={themeColors.appBarText}/>
        </Box>
        <Button
          color="inherit"
          component={RouterLink}
          to="/login"
          sx={{ color: themeColors.appBarText }}
        >
          Login
        </Button>
        <Button
          color="inherit"
          component={RouterLink}
          to="/signup"
          sx={{ color: themeColors.appBarText }}
        >
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>

    <Box
      sx={{
        pt: 12,
        pb: 10,
        textAlign: 'center',
        color: themeColors.appBarText,
        backgroundImage: `linear-gradient(rgba(0, 77, 64, 0.65), rgba(0, 77, 64, 0.65)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 77, 64, 0.65)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Unlock Your Best Self with NutriWise
        </Typography>
        <Typography
          variant="h5"
          component="p"
          paragraph
          sx={{ mb: 5, opacity: 0.9 }}
        >
          Personalized nutrition and fitness plans designed for your unique
          goals and needs. Achieve sustainable results with science-backed
          recommendations.
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
            '&:hover': { backgroundColor: '#FFB300' },
          }}
        >
          Get Started Now
        </Button>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: '600', color: themeColors.textPrimary, mb: 6 }}
      >
        How NutriWise Empowers You
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <FlipCard
          image={main4Image}
          title="Personalized Meal Plans"
          description="Delicious and balanced meal plans tailored to your dietary preferences, calorie needs, and fitness objectives."
        />
        <FlipCard
          image={imageAvif}
          title="Custom Workout Routines"
          description="Effective workout programs designed for your fitness level, available equipment, and desired outcomes (weight loss, muscle gain, etc.)."
        />
        <FlipCard
          image={medicalImage}
          title="Medical Document Integration"
          description="Securely upload medical documents to help us adapt recommendations for conditions like diabetes, ensuring your plan is safe and effective."
        />
        <FlipCard
          image={main4Image}
          title="Health-Specific Adaptations"
          description="Our system intelligently adjusts your plans based on your provided health information, making your journey both effective and safe."
        />
      </Box>
    </Container>

    <Box
      sx={{
        textAlign: 'center',
        py: 4,
        backgroundColor: themeColors.primary,
        color: themeColors.appBarText,
        mt: 'auto',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} NutriWise. All rights reserved.
      </Typography>
    </Box>
  </Box>
);

function App() {
  return (
    <Router>
      <CssBaseline/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route
          path="/dashboard"
          element={(
            <>
              <TopNavBar/>
              <DashboardHome/>
            </>
          )}
        />
        <Route
          path="/generate"
          element={(
            <>
              <TopNavBar/>
              <GeneratePlanPage/>
            </>
          )}
        />
        <Route
          path="/upload"
          element={(
            <>
              <TopNavBar/>
              <UploadDocumentsPage/>
            </>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
