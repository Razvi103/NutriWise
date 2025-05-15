import React, { useState } from 'react';
import {
  Box,
  Dialog,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Autocomplete,
} from '@mui/material';
import mainBg from '../assets/Main/main3.png';
import mainHero from '../assets/Main/main4.png';
import mealImg from '../assets/Meal/mealplans.png';
import fitnessImg from '../assets/Workout/18-gym-constanta-sala-fitness-14.png';
import mealHero from '../assets/Meal/meal-plan-paper.png';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FlagIcon from '@mui/icons-material/Flag';
import { Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { auth } from '../services/firebase';

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

const animatedGradient = `linear-gradient(120deg, #43cea2 0%, #185a9d 100%)`;

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
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

const DashboardHome: React.FC = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    activity: '',
    goal: '',
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const isProfileIncomplete =
    !profile.name ||
    !profile.age ||
    !profile.gender ||
    !profile.weight ||
    !profile.height ||
    !profile.activity ||
    !profile.goal;

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
      {isProfileIncomplete && (
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
      {/* Main content */}
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
        {/* Fitness Plan Week View */}
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
    }, 1800);
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
          Let's create your next plan!
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
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
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
      setFiles((prev) => [...prev, ...Array.from(fileList)]);
    }
  };
  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 1200);
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
            Allowed: PDF, JPG, PNG (max 5MB each)
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
              {files.map((file, idx) => (
                <Box
                  key={idx}
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
                    onClick={() => handleRemove(idx)}
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
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
        </Button>
      </Card>
    </Box>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const user = auth.currentUser;
  const email = user?.email || '';
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const getInitials = () => {
    if (!email) {
      return 'U';
    }
    const namePart = email.split('@')[0];
    return namePart.slice(0, 2).toUpperCase();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
    >
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 440,
          width: '100%',
          borderRadius: 6,
          boxShadow: 'none',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(67,206,162,0.10)',
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
          <CloseIcon sx={{ color: '#43cea2' }} />
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
              startAdornment: <EmailIcon sx={{ color: '#43cea2', mr: 1 }} />,
            }}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              size="small"
              type="number"
              InputProps={{
                startAdornment: <CakeIcon sx={{ color: '#43cea2', mr: 1 }} />,
              }}
            />
            <TextField
              label="Sex"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
              size="small"
              select
              InputProps={{
                startAdornment: <WcIcon sx={{ color: '#43cea2', mr: 1 }} />,
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
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              size="small"
              type="number"
              InputProps={{
                startAdornment: (
                  <FitnessCenterIcon sx={{ color: '#43cea2', mr: 1 }} />
                ),
              }}
            />
            <TextField
              label="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              fullWidth
              size="small"
              type="number"
              InputProps={{
                startAdornment: <HeightIcon sx={{ color: '#43cea2', mr: 1 }} />,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Fitness Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              fullWidth
              size="small"
              select
              InputProps={{
                startAdornment: <FlagIcon sx={{ color: '#43cea2', mr: 1 }} />,
              }}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="weight_loss">Weight Loss</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
            </TextField>
            <TextField
              label="Activity Level"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              fullWidth
              size="small"
              select
              InputProps={{
                startAdornment: (
                  <DirectionsRunIcon sx={{ color: '#43cea2', mr: 1 }} />
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
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            fullWidth
            size="small"
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

export { DashboardHome, GeneratePlanPage, UploadDocumentsPage, ProfileDialog };
