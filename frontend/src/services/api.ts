/* eslint-disable*/
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

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

export const getProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/get_user`, {
      params: { user_id: userId },
    });
    return JSON.parse(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch profile');
  }
};

export const updateProfile = async (
  userId: string,
  profile: Partial<UserProfile>,
) => {
  try {
    await axios.patch(`${API_BASE_URL}/api/users/update_profile_data`, null, {
      params: {
        user_id: userId,
        weight: profile.weight === null ? undefined : profile.weight,
        height: profile.height === null ? undefined : profile.height,
        age: profile.age === null ? undefined : profile.age,
        sex: profile.sex,
        fitness_goal: profile.fitness_goal,
        dietary_preferences: profile.dietary_preferences,
        activity_level: profile.activity_level,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to update profile');
  }
};

export const createUser = async (userId: string) => {
  try {
    await axios.post(`${API_BASE_URL}/api/users/create_user`, null, {
      params: { user_id: userId },
    });
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

export const createMealPlan = async (userId: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/meal_plans/create_meal_plan`, null, {
      params: { user_id: userId },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to create meal plan');
  }
};

export const getUserMealPlan = async (userId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/meal_plans/get_user_meal_plan`, {
      params: { user_id: userId },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to get user meal plan');
  }
};