import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const profileService = {
  createProfile: async (profileData) => {
    const response = await api.post('/profiles/', profileData);
    return response.data;
  },

  getProfile: async (profileId) => {
    const response = await api.get(`/profiles/${profileId}`);
    return response.data;
  },

  updateProfile: async (profileId, profileData) => {
    const response = await api.put(`/profiles/${profileId}`, profileData);
    return response.data;
  },
};

export default api; 