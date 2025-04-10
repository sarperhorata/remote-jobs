import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadProfilePhoto = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/profile/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 