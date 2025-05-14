import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut, User } from 'firebase/auth';
import { themeColors } from '../theme';
import ProfileForm, { ProfileFormData } from '../components/dashboard/ProfileForm';
import PlanCard from '../components/dashboard/PlanCard';
import { plans, Plan } from '../data/planData';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout Error:', error);
            alert('Failed to log out.');
        }
    };

    const handleProfileSubmit = (data: ProfileFormData) => {
        console.log('Profile data submitted (local state):', data);
        setProfileData(data);
        setIsProfileModalOpen(false);
        alert('Profile saved (locally)!');
    };

    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    const getDisplayName = () => {
        return currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
    };

    const handleViewPlan = (plan: Plan) => setSelectedPlan(plan);
    const handleClosePlanModal = () => setSelectedPlan(null);

    if (!currentUser) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeColors.background }}>
            <AppBar position="sticky" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: themeColors.appBarText }}>
                        NutriWise Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={openProfileModal} sx={{ color: themeColors.appBarText, mr: 1 }}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Button color="inherit" onClick={handleLogout} sx={{ color: themeColors.appBarText }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Dialog open={isProfileModalOpen} onClose={closeProfileModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: themeColors.primary, color: themeColors.appBarText }}>
                    My Profile
                    <IconButton
                        aria-label="close"
                        onClick={closeProfileModal}
                        sx={{
                            position: 'absolute', right: 8, top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                        Complete or update your profile to get personalized plans.
                    </Typography>
                    <ProfileForm onSubmit={handleProfileSubmit} initialData={profileData || undefined} />
                </DialogContent>
            </Dialog>

            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: themeColors.textPrimary, mb: 1 }}>
                    Welcome, {getDisplayName()}!
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: themeColors.textSecondary, mb: 3 }}>
                    Explore Fitness Plans
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
                    {plans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onView={handleViewPlan} />
                    ))}
                </Box>
            </Container>

            <Dialog open={!!selectedPlan} onClose={handleClosePlanModal} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedPlan?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedPlan?.details}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePlanModal}>Close</Button>
                    <Button variant="contained" color="primary" onClick={() => alert('Plan started! (demo)')}>Start Plan</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ textAlign: 'center', py: 3, backgroundColor: themeColors.primary, color: themeColors.appBarText, mt: 'auto' }}>
                <Typography variant="body2">&copy; {new Date().getFullYear()} NutriWise. All rights reserved.</Typography>
            </Box>
        </Box>
    );
};

export default DashboardPage; 