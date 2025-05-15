import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth, googleAuthProvider } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

interface IFormInput {
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IFormInput>();
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setFirebaseError(null);

    try {
      if (mode === 'signup') {
        if (data.password !== data.confirmPassword) {
          setFirebaseError("Passwords don't match!");
          setIsLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        alert('Signup successful! User created.');
        reset();
        navigate('/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        alert('Login successful!');
        reset();
        navigate('/dashboard');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Firebase Auth Error:', authError);
      setFirebaseError(authError.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFirebaseError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      navigate('/dashboard');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google Sign-In Error:', authError);
      setFirebaseError(authError.message || 'Could not sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Typography>
        {firebaseError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {firebaseError}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {mode === 'signup' && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'The passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading
              ? 'Processing...'
              : mode === 'login'
                ? 'Sign In'
                : 'Sign Up'}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            Sign In with Google
          </Button>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 1,
            }}
          >
            {mode === 'login' ? (
              <MuiLink component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            ) : (
              <MuiLink component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </MuiLink>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthForm;
