import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  Tooltip,
  CircularProgress,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getProfile, createMealPlan } from '../services/api';
import ProfileDialog from './ProfileDialog';
import mealImg from '../assets/Meal/mealplans.png';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getUserMealPlan } from '../services/api';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activity: string;
  goal: string;
}

interface MealPlanDay {
  meal_slot: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  macros: string;
}

interface UploadFile {
  id: string;
  file: File;
}

const TIMEOUT_DURATION = {
    SAVE: 1200,
    FEEDBACK: 1800,
};

const DAYS_IN_WEEK = 7;
const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
const motivationalQuotes = [
  'Every step counts. Start your journey today!',
  'Small changes make a big difference.',
  'Your health is your wealth.',
  'Consistency beats intensity.',
  'Fuel your body, empower your life.',
];

const glassCard = {
  minWidth: 320,
  maxWidth: 400,
  p: 0,
  borderRadius: 5,
  boxShadow: 6,
  background: 'rgba(255,255,255,0.80)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(255,255,255,0.25)',
  transition: 'transform 0.18s, box-shadow 0.18s',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.03)',
    boxShadow: 12,
  },
};

const DashboardHome = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<MealPlanDay[]>([]);
  const location = useLocation();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        console.log("[DEBUG] Auth state changed, user is logged in:", userId);
        fetchProfile(userId);
        fetchMealPlan(userId);
      } else {
        console.log("[DEBUG] Auth state changed, user is logged out.");
        setLoading(false);
        setProfile(null);
        setPlan([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const data = await getProfile(userId);
      setProfile({
        name: '',
        age: data.age?.toString() || '',
        gender: data.sex || '',
        weight: data.weight?.toString() || '',
        height: data.height?.toString() || '',
        activity: data.activity_level || '',
        goal: data.fitness_goal || '',
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setProfile(null);
    } finally {
    }
  };

  const fetchMealPlan = async (userId: string) => {
    try {
      const response = await getUserMealPlan(userId);
      console.log('GeneratePlanPage - API Response:', response);
      if (response?.plan && Array.isArray(response.plan)) {
        setPlan(response.plan as MealPlanDay[]);
      } else {
        console.warn('No valid meal plan found in response.');
        console.log('[DEBUG] Response causing warning:', response);
        setPlan([]);
      }
    } catch (err) {
      console.error('Failed to fetch user meal plan:', err);
      setPlan([]);
    }
  };

  useEffect(() => {
    if (profile !== null || plan.length > 0) {
        setLoading(false);
    } else if (user && profile === null && plan.length === 0) {
        setLoading(false);
    }
  }, [profile, plan, user]);

  const isProfileIncomplete =
    !loading &&
    profile &&
    Object.entries(profile).some(([key, value]) => {
      if (key === 'name') return false;
      return !value || (typeof value === 'string' && value.trim() === '');
    });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pb: 8,
      }}
    >
      {!loading && isProfileIncomplete && (
        <Box
          sx={{
            width: '100%',
            background: 'linear-gradient(90deg, #fffbe7 0%, #fffde4 100%)',
            color: '#004D40',
            py: 1.2,
            textAlign: 'center',
            boxShadow: '0 2px 8px 0 rgba(255,193,7,0.08)',
            fontWeight: 600,
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          Please complete your profile for personalized recommendations.
          <Button
            variant="contained"
            sx={{ ml: 2, background: 'linear-gradient(90deg, #FFC107 0%, #43cea2 100%)' }}
            onClick={() => setProfileOpen(true)}
          >
            Complete Profile
          </Button>
        </Box>
      )}

      <Box sx={{ width: '100%', maxWidth: 1100, mt: 6, px: 2 }}>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 2, textAlign: 'center' }}>
          Your Personalized Meal Plan
        </Typography>
        <Typography variant="h6" sx={{ color: '#FFC107', mb: 4, textAlign: 'center' }}>
          {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
        </Typography>

        <Button
          variant="contained"
          onClick={() => window.print()}
          sx={{ mb: 4, color: '#004D40', borderColor: '#FFC107', fontWeight: 600, backgroundColor:  '#FFC107'  }}
        >
          Print or Export to PDF
        </Button>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {plan.map((day, idx) => (
            <Card
              key={day.meal_slot}
              sx={{
                p: 2,
                borderRadius: 4,
                background:
                  idx === todayIdx
                    ? 'linear-gradient(120deg, #fffde4 0%, #43cea2 100%)'
                    : 'rgba(255,255,255,0.9)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: idx === todayIdx ? '#FFC107' : '#004D40', fontWeight: 'bold', mb: 1 }}
              >
                {day.meal_slot}
              </Typography>
              <Avatar src={mealImg} sx={{ width: 44, height: 44, mb: 1 }} />
              <Tooltip title={day.macros} arrow placement="top">
                <Box sx={{ cursor: 'help' }}>
                  <Typography variant="body2" sx={{ color: '#004D40', whiteSpace: 'pre-line' }}>
                    <strong>Breakfast:</strong> {day.breakfast}{'\n'}
                    <strong>Lunch:</strong> {day.lunch}{'\n'}
                    <strong>Dinner:</strong> {day.dinner}{'\n'}
                    <strong>Snack:</strong> {day.snack}
                  </Typography>
                </Box>
              </Tooltip>
            </Card>
          ))}
        </Box>
      </Box>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  );
};

const GeneratePlanPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const userId = user?.uid;
  
    if (!userId) {
      setError('You must be logged in to generate a plan');
      setLoading(false);
      return;
    }
  
    try {
      const response = await createMealPlan(userId);
      console.log('GeneratePlanPage - API Response:', response);
  
      if (response && response.plan && Array.isArray(response.plan)) {
        setResult(response.description || "Meal plan generated successfully!");
        navigate('/dashboard');
      } else {
        console.error('GeneratePlanPage - Response missing plan:', response);
        setError('Failed to process the generated plan. Invalid structure.');
      }
    } catch (err) {
      console.error('GeneratePlanPage - Error during generation:', err);
      setError('Failed to generate plan. Complete your profile and medical conditions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pb: 0,
      }}
    >
      <Box sx={{ maxWidth: 700, mb: 4, px: 4, textAlign: 'center' }}>
        <AutoAwesomeIcon sx={{ fontSize: 48, color: '#FFC107', mb: 1 }} />
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
          Let's create your next plan!
        </Typography>
        <Typography variant="h5" sx={{ color: '#FFC107', mb: 2 }}>
          Our AI will generate a personalized meal for you.
        </Typography>
      </Box>

      <Card sx={{ ...glassCard, maxWidth: 500, p: 4, boxShadow: 8 }}>
        <Typography variant="h5" sx={{ color: '#004D40', fontWeight: 'bold', textAlign: 'center' }}>
          Ready to transform your health journey?
        </Typography>
        <Typography variant="body1" sx={{ color: '#00796B', textAlign: 'center', mb: 2 }}>
          Click the button below to generate your personalized plan based on your profile and goals.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            px: 6,
            py: 2,
            fontWeight: 'bold',
            fontSize: 20,
            borderRadius: 3,
            background: 'linear-gradient(90deg, #FFC107 0%, #43cea2 100%)',
            color: '#004D40',
            boxShadow: 2,
            textAlign: 'center',
          }}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : 'Generate My Plan'}
        </Button>
        </Box>
      </Card>

      {error && (
        <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
          {error}
        </Typography>
      )}
      {result && (
        <Typography variant="body2" sx={{ color: '#004D40', mt: 2 }}>
          {result}
        </Typography>
      )}
    </Box>
  );
};

const medicalConditionsList = [
    'Diabetes',
    'Hypertension',
    'Allergies',
    'Asthma',
    'Heart Disease',
    'Other',
];

const UploadDocumentsPage: React.FC = () => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [medicalConditions, setMedicalConditions] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = auth.currentUser;
    const userId = user?.uid;

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                file,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const newFiles = Array.from(fileList).map((file) => ({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                file,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleRemove = (fileId: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const getButtonText = () => {
        if (saving) {
            return 'Saving...';
        }
        if (saved) {
            return 'Saved';
        }
        return 'Save';
    };

    const handleSave = async () => {
        if (!userId) {
            setError('You must be logged in to save medical conditions');
            return;
        }
    
        setSaving(true);
        setError(null);
        
        try {
            if (medicalConditions.trim()) {
                const medicalResponse = await fetch(
                    `http://localhost:8001/api/users/update_medical_conditions?user_id=${userId}&medical_conditions_text=${encodeURIComponent(medicalConditions)}`, 
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
    
                if (!medicalResponse.ok) {
                    throw new Error('Failed to save medical conditions');
                }
            }
    
            if (files.length > 0) {
                if (files.length > 1) {
                    setError('Only one file can be uploaded at a time');
                    return;
                }
    
                const formData = new FormData();
                formData.append('uploaded_file', files[0].file);
                
                const fileResponse = await fetch(`http://localhost:8001/api/files/process_file?user_id=${userId}`, {
                    method: 'POST',
                    body: formData,
                });
    
                if (!fileResponse.ok) {
                    throw new Error('Failed to upload file');
                }
            }
    
            setSaved(true);
            setTimeout(() => setSaved(false), TIMEOUT_DURATION.FEEDBACK);
        } catch (error) {
            console.error('Error saving data:', error);
            setError('Failed to save data. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pb: 8,
            }}
        >
            <Box
                sx={{ width: '100%', maxWidth: 600, mt: 8, mb: 4, textAlign: 'center' }}
            >
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                    Upload Medical Documents
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ color: '#FFC107', fontWeight: 500, mb: 2 }}
                >
                    Add your medical documents for safer, more personalized
                    recommendations.
                </Typography>
            </Box>
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 5,
                    boxShadow: 'none',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(67,206,162,0.10)',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        width: '100%',
                        minHeight: 140,
                        border: dragActive
                            ? '2.5px dashed #FFC107'
                            : '2.5px dashed #43cea2',
                        borderRadius: 4,
                        background: dragActive
                            ? 'rgba(255,193,7,0.08)'
                            : 'rgba(67,206,162,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border 0.2s, background 0.2s',
                        cursor: 'pointer',
                        mb: 2,
                        p: 2,
                    }}
                >
                    <CloudUploadIcon
                        sx={{
                            fontSize: 38,
                            color: dragActive ? '#FFC107' : '#43cea2',
                            mb: 1,
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{ color: dragActive ? '#FFC107' : '#43cea2', fontWeight: 600 }}
                    >
                        Drag & drop files here
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#757575', mt: 1 }}>
                        or
                    </Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 1, fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Browse Files
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                    </Button>
                    <Typography variant="caption" sx={{ color: '#757575', mt: 1 }}>
                        Allowed: PDF (max 5MB each)
                    </Typography>
                </Box>
                {files.length > 0 && (
                    <Box sx={{ width: '100%', mt: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: '#004D40', fontWeight: 600, mb: 1 }}
                        >
                            Files to upload:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {files.map(({ id, file }) => (
                                <Box
                                    key={id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'rgba(67,206,162,0.08)',
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#185a9d' }}>
                                        {file.name}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemove(id)}
                                        sx={{ ml: 2, fontWeight: 'bold' }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
                <Box sx={{ width: '100%' }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: '#004D40', fontWeight: 600, mb: 1 }}
                    >
                        Do you have any medical conditions we should know about?
                    </Typography>
                    <TextField
                        label="Medical Conditions"
                        value={medicalConditions}
                        onChange={(e) => setMedicalConditions(e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g. Diabetes, Hypertension, Allergies"
                    />
                </Box>
                {error && (
                    <Typography color="error" sx={{ width: '100%', textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={saving || !userId}
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
                    {getButtonText()}
                </Button>
            </Card>
        </Box>
    );
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export { DashboardHome, GeneratePlanPage, UploadDocumentsPage };
