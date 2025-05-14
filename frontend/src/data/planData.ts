import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import { ReactNode } from 'react';

export type Plan = {
  id: string;
  title: string;
  description: string;
  icon: 'fitness' | 'restaurant' | 'description' | 'security';
  details: string;
};

export const plans: Plan[] = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description:
      'A calorie deficit plan with balanced nutrition and fat-burning workouts.',
    icon: 'fitness',
    details:
      'This plan includes a meal schedule, recipes, and daily workouts focused on burning fat.',
  },
  {
    id: 'muscle-gain',
    title: 'Muscle Gain',
    description:
      'High-protein meals and strength training routines to build muscle mass.',
    icon: 'restaurant',
    details:
      'This plan provides protein-rich meals and progressive resistance workouts.',
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description:
      'Maintain your current weight and fitness with balanced meals and moderate activity.',
    icon: 'description',
    details:
      'This plan helps you maintain your current physique with a balanced approach.',
  },
  {
    id: 'custom',
    title: 'Custom Plan',
    description:
      'Personalized plan based on your unique goals and medical needs.',
    icon: 'security',
    details:
      'Upload your medical documents and set your preferences for a fully personalized plan.',
  },
];
