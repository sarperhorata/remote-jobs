import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class JobService {
  // Fetch jobs with filters and pagination
  async fetchJobs({ page = 1, limit = 10, ...filters } = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/jobs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }
  
  // Fetch job by ID
  async fetchJobById(id) {
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Fetch similar jobs based on skills
  async fetchSimilarJobs(jobId) {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      throw error;
    }
  }
  
  // Fetch jobs by skill
  async fetchJobsBySkill(skill, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/jobs/skill/${skill}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching jobs with skill ${skill}:`, error);
      throw error;
    }
  }
  
  // Search jobs
  async searchJobs(query, filters = {}, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/jobs/search`, {
        params: {
          q: query,
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }
  
  // Save a job
  async saveJob(jobId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/jobs/${jobId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }
  
  // Remove saved job
  async removeSavedJob(jobId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.delete(`${API_URL}/jobs/${jobId}/save`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  }
  
  // Get saved jobs
  async getSavedJobs(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(`${API_URL}/jobs/saved`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  }
  
  // Apply for a job
  async applyForJob(jobId, applicationData = {}) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        `${API_URL}/jobs/${jobId}/apply`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }
}

export const jobService = new JobService(); 