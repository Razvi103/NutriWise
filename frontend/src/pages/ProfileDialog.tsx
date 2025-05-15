import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Card,
  IconButton,
  Box,
  Avatar,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FlagIcon from '@mui/icons-material/Flag';
import { getProfile, updateProfile, createUser } from '../services/api';
import { auth } from '../services/firebase';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ProfileData {
  age: number | null;
  sex: string;
  weight: number | null;
  height: number | null;
  activity_level: string;
  fitness_goal: string;
  dietary_preferences: string;
}

interface ValidationErrors {
  age?: string;
  sex?: string;
  weight?: string;
  height?: string;
  activity_level?: string;
  fitness_goal?: string;
  dietary_preferences?: string;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const user = auth.currentUser;
  const userId = user?.uid || '';
  const email = user?.email || '';
  const [profile, setProfile] = useState<ProfileData>({
    age: null,
    sex: '',
    weight: null,
    height: null,
    activity_level: '',
    fitness_goal: '',
    dietary_preferences: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (open && userId) {
      getProfile(userId)
        .then((data) => {
          setProfile({
            age: data.age || null,
            sex: data.sex || '',
            weight: data.weight || null,
            height: data.height || null,
            activity_level: data.activity_level || '',
            fitness_goal: data.fitness_goal || '',
            dietary_preferences: data.dietary_preferences || '',
          });
          setErrors({});
          setApiError('');
        })
        .catch((err) => {
          if (err.message === 'User not found') {
            createUser(userId).then(() => {
              setTimeout(() => {
                getProfile(userId).then((data) => {
                  setProfile({
                    age: data.age || null,
                    sex: data.sex || '',
                    weight: data.weight || null,
                    height: data.height || null,
                    activity_level: data.activity_level || '',
                    fitness_goal: data.fitness_goal || '',
                    dietary_preferences: data.dietary_preferences || '',
                  });
                });
              }, 1000);
            });
          }
        });
    }
  }, [open, userId]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profile.age) {
      newErrors.age = 'Age is required';
    } else if (profile.age < 12 || profile.age > 120) {
      newErrors.age = 'Age must be between 12 and 120';
    }

    if (!profile.sex) {
      newErrors.sex = 'Sex is required';
    }

    if (!profile.weight) {
      newErrors.weight = 'Weight is required';
    } else if (profile.weight < 30 || profile.weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }

    if (!profile.height) {
      newErrors.height = 'Height is required';
    } else if (profile.height < 100 || profile.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }

    if (!profile.activity_level) {
      newErrors.activity_level = 'Activity level is required';
    }
    if (!profile.fitness_goal) {
      newErrors.fitness_goal = 'Fitness goal is required';
    }
    if (!profile.dietary_preferences) {
      newErrors.dietary_preferences = 'Dietary preferences are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (['age', 'weight', 'height'].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : null,
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = () => {
    setApiError('');
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    updateProfile(userId, profile)
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
        setApiError(error.message || 'Failed to update profile');
      })
      .finally(() => setSaving(false));
  };

  const getInitials = () => {
    if (!email) {
      return 'U';
    }
    const namePart = email.split('@')[0];
    return namePart.slice(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 440,
          width: '100%',
          borderRadius: 6,
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: '#fff',
            boxShadow: 1,
          }}
        >
          <CloseIcon sx={{ color: '#43cea2' }}/>
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 84,
              height: 84,
              bgcolor: '#43cea2',
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            {getInitials()}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#004D40', mt: 1 }}
          >
            Profile
          </Typography>
          <Typography variant="body2" sx={{ color: '#00796B', mb: 1 }}>
            Your personal information
          </Typography>
        </Box>
        {apiError && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {apiError}
          </Alert>
        )}
        <Box
          component="form"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Email"
            value={email}
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
              startAdornment: <EmailIcon sx={{ color: '#43cea2', mr: 1 }}/>,
            }}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Age"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              fullWidth
              size="small"
              type="number"
              required
              error={!!errors.age}
              helperText={errors.age}
              InputProps={{
                startAdornment: <CakeIcon sx={{ color: '#43cea2', mr: 1 }}/>,
                inputProps: { min: 12, max: 120 },
              }}
            />
            <TextField
              label="Sex"
              name="sex"
              value={profile.sex}
              onChange={handleChange}
              fullWidth
              size="small"
              select
              required
              error={!!errors.sex}
              helperText={errors.sex}
              InputProps={{
                startAdornment: <WcIcon sx={{ color: '#43cea2', mr: 1 }}/>,
              }}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Weight (kg)"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              fullWidth
              size="small"
              type="number"
              required
              error={!!errors.weight}
              helperText={errors.weight}
              InputProps={{
                startAdornment: (
                  <FitnessCenterIcon sx={{ color: '#43cea2', mr: 1 }}/>
                ),
                inputProps: { min: 30, max: 300 },
              }}
            />
            <TextField
              label="Height (cm)"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              fullWidth
              size="small"
              type="number"
              required
              error={!!errors.height}
              helperText={errors.height}
              InputProps={{
                startAdornment: <HeightIcon sx={{ color: '#43cea2', mr: 1 }}/>,
                inputProps: { min: 100, max: 250 },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Fitness Goal"
              name="fitness_goal"
              value={profile.fitness_goal}
              onChange={handleChange}
              fullWidth
              size="small"
              select
              required
              error={!!errors.fitness_goal}
              helperText={errors.fitness_goal}
              InputProps={{
                startAdornment: <FlagIcon sx={{ color: '#43cea2', mr: 1 }}/>,
              }}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="weight_loss">Weight Loss</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
            </TextField>
            <TextField
              label="Activity Level"
              name="activity_level"
              value={profile.activity_level}
              onChange={handleChange}
              fullWidth
              size="small"
              select
              required
              error={!!errors.activity_level}
              helperText={errors.activity_level}
              InputProps={{
                startAdornment: (
                  <DirectionsRunIcon sx={{ color: '#43cea2', mr: 1 }}/>
                ),
              }}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="sedentary">Sedentary</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="active">Active</MenuItem>
            </TextField>
          </Box>
          <TextField
            label="Dietary Preferences"
            name="dietary_preferences"
            value={profile.dietary_preferences}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.dietary_preferences}
            helperText={errors.dietary_preferences}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            sx={{
              mt: 2,
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #FFC107 0%, #43cea2 100%)',
              color: '#004D40',
              boxShadow: 1,
              py: 1.2,
              transition: 'background 0.18s, box-shadow 0.18s',
              '&:hover': {
                background: 'linear-gradient(90deg, #43cea2 0%, #FFC107 100%)',
                color: '#004D40',
                boxShadow: 4,
              },
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </Button>
        </Box>
      </Card>
    </Dialog>
  );
};

export default ProfileDialog;