import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Card,
    CardContent,
    TextField,
    CircularProgress,
    Slide,
} from '@mui/material';
import mainBg from '../assets/Main/main3.png';
import mealImg from '../assets/Meal/mealplans.png';
import fitnessImg from '../assets/Workout/18-gym-constanta-sala-fitness-14.png';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ProfileDialog from './ProfileDialog';
import { TransitionProps } from '@mui/material/transitions';
import { auth } from '../services/firebase';
import { getProfile } from '../services/api';
import { useEffect } from 'react';

const TIMEOUT_DURATION = {
    SAVE: 1200,
    FEEDBACK: 1800,
};

const DAYS_IN_WEEK = 7;
const todayIdx =
    new Date().getDay() === 0 ? DAYS_IN_WEEK - 1 : new Date().getDay() - 1;

const mealPlans = [
    { day: 'Mon', summary: 'Chicken, rice, salad', img: mealImg },
    { day: 'Tue', summary: 'Fish, quinoa, veggies', img: mealImg },
    { day: 'Wed', summary: 'Beef, potatoes, greens', img: mealImg },
    { day: 'Thu', summary: 'Pasta, turkey, salad', img: mealImg },
    { day: 'Fri', summary: 'Eggs, toast, avocado', img: mealImg },
    { day: 'Sat', summary: 'Salmon, couscous, veg', img: mealImg },
    { day: 'Sun', summary: 'Chicken, rice, salad', img: mealImg },
];

const fitnessPlans = [
    { day: 'Mon', summary: 'Cardio + Core', img: fitnessImg },
    { day: 'Tue', summary: 'Upper Body Strength', img: fitnessImg },
    { day: 'Wed', summary: 'Yoga & Mobility', img: fitnessImg },
    { day: 'Thu', summary: 'Lower Body Strength', img: fitnessImg },
    { day: 'Fri', summary: 'HIIT', img: fitnessImg },
    { day: 'Sat', summary: 'Active Rest', img: fitnessImg },
    { day: 'Sun', summary: 'Full Body', img: fitnessImg },
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

const motivationalQuotes = [
    'Every step counts. Start your journey today!',
    'Small changes make a big difference.',
    'Your health is your wealth.',
    'Consistency beats intensity.',
    'Fuel your body, empower your life.',
];

const animatedGradient = `linear-gradient(120deg, #43cea2 0%, #185a9d 100%)`;

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface UploadFile {
    id: string;
    file: File;
}
interface UserProfile {
    id: string;
    weight: number | null;
    height: number | null;
    age: number | null;
    sex: string;
    fitness_goal: string;
    dietary_preferences: string;
    activity_level: string;
    medical_conditions?: string;
    bmi?: number;
  }

interface Profile {
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    activity: string;
    goal: string;
}

const DashboardHome: React.FC = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            getProfile(user.uid)
                .then((data: UserProfile) => {
                    const mappedProfile: Profile = {
                        name: '',
                        age: data.age ? data.age.toString() : '',
                        gender: data.sex || '',
                        weight: data.weight ? data.weight.toString() : '',
                        height: data.height ? data.height.toString() : '',
                        activity: data.activity_level || '',
                        goal: data.fitness_goal || '',
                    };
                    setProfile(mappedProfile);
                })
                .catch((error) => {
                    console.error('Failed to fetch profile:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    const isProfileIncomplete = !loading && profile ? 
        Object.entries(profile).some(([key, value]) => {
            if (key === 'name') return false;
            return !value || value.trim() === '';
        }) : 
        false;

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
            {!loading && isProfileIncomplete && (
                <Box
                    sx={{
                        width: '100%',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        background: 'linear-gradient(90deg, #fffbe7 0%, #fffde4 100%)',
                        color: '#004D40',
                        px: { xs: 2, md: 0 },
                        py: 1.2,
                        textAlign: 'center',
                        boxShadow: '0 2px 8px 0 rgba(255,193,7,0.08)',
                        fontWeight: 600,
                        fontSize: 17,
                        letterSpacing: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <span>
                        Please complete your profile for personalized recommendations.
                    </span>
                    <Button
                        variant="contained"
                        sx={{
                            ml: 2,
                            background: 'linear-gradient(90deg, #FFC107 0%, #43cea2 100%)',
                            color: '#004D40',
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2.5,
                            py: 0.7,
                            fontSize: 15,
                            boxShadow: 1,
                            '&:hover': {
                                background: 'linear-gradient(90deg, #43cea2 0%, #FFC107 100%)',
                                color: '#004D40',
                            },
                        }}
                        onClick={() => setProfileOpen(true)}
                    >
                        Complete Profile
                    </Button>
                </Box>
            )}
            <Box sx={{ width: '100%', maxWidth: 1100, mt: 6, px: 2 }}>
                <Typography
                    variant="h4"
                    sx={{ color: '#fff', fontWeight: 800, mb: 3, letterSpacing: 1 }}
                >
                    Your Active Plans
                </Typography>
                {/* Meal Plan Week View */}
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h6"
                        sx={{ color: '#FFC107', fontWeight: 700, mb: 1 }}
                    >
                        Meal Plan (This Week)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                        {mealPlans.map((plan, idx) => (
                            <Box
                                key={plan.day}
                                sx={{
                                    minWidth: 150,
                                    maxWidth: 180,
                                    background:
                                        idx === todayIdx
                                            ? 'linear-gradient(120deg, #fffde4 0%, #43cea2 100%)'
                                            : 'rgba(255,255,255,0.80)',
                                    borderRadius: 4,
                                   boxShadow:
                                        idx === todayIdx
                                            ? '0 4px 18px 0 rgba(67,206,162,0.13)'
                                            : '0 2px 8px 0 rgba(67,206,162,0.08)',
                                    border:
                                        idx === todayIdx
                                            ? '2px solid #FFC107'
                                            : '1.5px solid rgba(67,206,162,0.13)',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'box-shadow 0.18s, border 0.18s',
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: idx === todayIdx ? '#FFC107' : '#004D40',
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    {plan.day}
                                </Typography>
                                <Avatar
                                    src={plan.img}
                                    alt={plan.day}
                                    sx={{ width: 44, height: 44, mb: 1, bgcolor: '#fff' }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#004D40', textAlign: 'center' }}
                                >
                                    {plan.summary}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ mb: 5 }}>
                    <Typography
                        variant="h6"
                        sx={{ color: '#43cea2', fontWeight: 700, mb: 1 }}
                    >
                        Fitness Plan (This Week)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                        {fitnessPlans.map((plan, idx) => (
                            <Box
                                key={plan.day}
                                sx={{
                                    minWidth: 150,
                                    maxWidth: 180,
                                    background:
                                        idx === todayIdx
                                            ? 'linear-gradient(120deg, #e0f7fa 0%, #43cea2 100%)'
                                            : 'rgba(255,255,255,0.80)',
                                    borderRadius: 4,
                                    boxShadow:
                                        idx === todayIdx
                                            ? '0 4px 18px 0 rgba(67,206,162,0.13)'
                                            : '0 2px 8px 0 rgba(67,206,162,0.08)',
                                    border:
                                        idx === todayIdx
                                            ? '2px solid #43cea2'
                                            : '1.5px solid rgba(67,206,162,0.13)',
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'box-shadow 0.18s, border 0.18s',
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: idx === todayIdx ? '#43cea2' : '#004D40',
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    {plan.day}
                                </Typography>
                                <Avatar
                                    src={plan.img}
                                    alt={plan.day}
                                    sx={{ width: 44, height: 44, mb: 1, bgcolor: '#fff' }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#004D40', textAlign: 'center' }}
                                >
                                    {plan.summary}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
        </Box>
    );
};

const pageBg = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(rgba(67,206,162,0.7), rgba(24,90,157,0.7)), url(${mainBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    p: 5,
};

const GeneratePlanPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            setResult('Your new AI-generated plan is ready! 🎉');
            setLoading(false);
        }, TIMEOUT_DURATION.FEEDBACK);
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
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 700,
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    px: 4,
                }}
            >
                <AutoAwesomeIcon
                    sx={{
                        fontSize: 48,
                        color: '#FFC107',
                        mb: 1,
                        filter: 'drop-shadow(0 2px 8px #fffbe7)',
                    }}
                />
                <Typography
                    variant="h2"
                    sx={{
                        color: '#fff',
                        fontWeight: 900,
                        textShadow: '0 2px 12px rgba(0,0,0,0.18)',
                        letterSpacing: 1,
                        mb: 1,
                        textAlign: 'center',
                    }}
                >
                    Let&apos;s create your next plan!
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#FFC107',
                        fontWeight: 400,
                        textShadow: '0 1px 6px rgba(0,0,0,0.10)',
                        textAlign: 'center',
                        maxWidth: 540,
                    }}
                >
                    Our AI will generate a personalized meal and fitness plan for you.
                </Typography>
                <Box
                    sx={{
                        width: 60,
                        height: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #FFC107 0%, #43cea2 100%)',
                        mt: 2,
                        mb: 1,
                    }}
                />
            </Box>

            <Card
                sx={{
                    ...glassCard,
                    width: '100%',
                    maxWidth: 500,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1.5px solid rgba(67,206,162,0.10)',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: 8,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ color: '#004D40', fontWeight: 'bold', textAlign: 'center' }}
                >
                    Ready to transform your health journey?
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: '#00796B', textAlign: 'center', mb: 2 }}
                >
                    Click the button below to generate your personalized plan based on
                    your profile and goals.
                </Typography>
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
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #43cea2 0%, #FFC107 100%)',
                            color: '#004D40',
                            transform: 'scale(1.04)',
                            boxShadow: 8,
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={28} color="inherit" />
                    ) : (
                        'Generate My Plan'
                    )}
                </Button>
            </Card>

            {result && (
                <Card
                    sx={{
                        ...glassCard,
                        width: '100%',
                        maxWidth: 500,
                        mt: 4,
                        border: '2px solid #FFC107',
                        background: 'rgba(255,255,255,0.95)',
                        animation: 'slideUp 0.5s ease-out',
                        '@keyframes slideUp': {
                            '0%': {
                                transform: 'translateY(20px)',
                                opacity: 0,
                            },
                            '100%': {
                                transform: 'translateY(0)',
                                opacity: 1,
                            },
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            p: 4,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#004D40',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            {result}
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                                '&:hover': {
                                    background:
                                        'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
                                },
                            }}
                        >
                            View My Plan
                        </Button>
                    </CardContent>
                </Card>
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
