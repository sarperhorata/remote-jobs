import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string;
}

interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}

class JobService {
  async fetchJobs(filters: JobFilters = {}) {
    try {
      const response = await axios.get(`${API_URL}/jobs`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async fetchJobById(id: string): Promise<Job> {
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }

  async fetchSimilarJobs(jobId: string): Promise<Job[]> {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      throw error;
    }
  }

  async saveJob(jobId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/jobs/${jobId}/save`);
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  async removeSavedJob(jobId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/jobs/${jobId}/save`);
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  }

  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await axios.get(`${API_URL}/jobs/saved`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  }

  async applyForJob(jobId: string, application: any): Promise<void> {
    try {
      await axios.post(`${API_URL}/jobs/${jobId}/apply`, application);
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }
}

export const jobService = new JobService(); 