import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const jobService = {
  // Fetch jobs with filters and pagination
  fetchJobs: async (filters = {}, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: {
          ...filters,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Fetch job by ID
  fetchJobById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Fetch similar jobs based on skills
  fetchSimilarJobs: async (jobId, skills, limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}/similar`, {
        params: {
          skills: skills.join(','),
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      throw error;
    }
  },

  // Save job for later
  saveJob: async (jobId) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/save`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Remove saved job
  removeSavedJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}/save`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/saved`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/apply`, applicationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Admin functions
  // Create a new job (admin only)
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update a job (admin only)
  updateJob: async (jobId, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Soft delete a job (admin only)
  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Get archived jobs (admin only)
  getArchivedJobs: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/archived`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived jobs:', error);
      throw error;
    }
  },

  // Restore an archived job (admin only)
  restoreJob: async (jobId) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/${jobId}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error restoring job:', error);
      throw error;
    }
  }
};

export default jobService; 