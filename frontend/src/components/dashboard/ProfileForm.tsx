import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

export interface ProfileFormData {
    height: number | string; 
    weight: number | string;
    age: number | string;
    sex: 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';
    fitnessGoal: string;
}

interface ProfileFormProps {
    onSubmit: (data: ProfileFormData) => void;
    initialData?: Partial<ProfileFormData>; 
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        defaultValues: initialData || {
            height: '',
            weight: '',
            age: '',
            sex: '',
            fitnessGoal: '',
        },
    });

    const handleFormSubmit: SubmitHandler<ProfileFormData> = (data) => {
        const processedData = {
            ...data,
            height: parseFloat(data.height as string) || 0,
            weight: parseFloat(data.weight as string) || 0,
            age: parseInt(data.age as string, 10) || 0,
        };
        onSubmit(processedData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                <Controller
                    name="height"
                    control={control}
                    rules={{ required: 'Height is required', min: { value: 1, message: 'Height must be positive' } }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="Height (cm)"
                            fullWidth
                            required
                            error={!!errors.height}
                            helperText={errors.height?.message}
                            sx={{ flexGrow: 1 }}
                        />
                    )}
                />
                <Controller
                    name="weight"
                    control={control}
                    rules={{ required: 'Weight is required', min: { value: 1, message: 'Weight must be positive' } }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="Weight (kg)"
                            fullWidth
                            required
                            error={!!errors.weight}
                            helperText={errors.weight?.message}
                            sx={{ flexGrow: 1 }}
                        />
                    )}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                <Controller
                    name="age"
                    control={control}
                    rules={{ required: 'Age is required', min: { value: 1, message: 'Age must be positive' }, max: { value: 120, message: 'Age seems unlikely' } }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="Age"
                            fullWidth
                            required
                            error={!!errors.age}
                            helperText={errors.age?.message}
                            sx={{ flexGrow: 1 }}
                        />
                    )}
                />
                <FormControl fullWidth required error={!!errors.sex} sx={{ flexGrow: 1 }}>
                    <InputLabel id="sex-select-label">Sex</InputLabel>
                    <Controller
                        name="sex"
                        control={control}
                        rules={{ required: 'Sex is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="sex-select-label"
                                label="Sex"
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                            </Select>
                        )}
                    />
                    {errors.sex && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{errors.sex.message}</Typography>}
                </FormControl>
            </Box>

            <Controller
                name="fitnessGoal"
                control={control}
                rules={{ required: 'Fitness goal is required', minLength: { value: 3, message: 'Describe your goal in a bit more detail' } }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Fitness Goal (e.g., Weight Loss, Muscle Gain)"
                        fullWidth
                        required
                        multiline
                        rows={3}
                        error={!!errors.fitnessGoal}
                        helperText={errors.fitnessGoal?.message}
                        sx={{ mb: 2 }}
                    />
                )}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Save Profile
            </Button>
        </Box>
    );
};

export default ProfileForm; 