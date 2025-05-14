import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import { Container, Paper, Typography, Box } from '@mui/material';
import { themeColors } from '../theme';

const SignupPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: themeColors.background,
                py: 4,
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: themeColors.paperBackground,
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3, color: themeColors.primary }}>
                        Create Your NutriWise Account
                    </Typography>
                    <AuthForm mode="signup" />
                </Paper>
            </Container>
        </Box>
    );
};

export default SignupPage;