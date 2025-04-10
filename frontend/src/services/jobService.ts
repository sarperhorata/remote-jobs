import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Job {
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

class JobService {
  async fetchJobById(id: string): Promise<Job> {
    const response = await axios.get(`${API_URL}/api/jobs/${id}`);
    return response.data;
  }

  async fetchSimilarJobs(jobId: string): Promise<Job[]> {
    const response = await axios.get(`${API_URL}/api/jobs/${jobId}/similar`);
    return response.data;
  }

  async saveJob(jobId: string): Promise<void> {
    await axios.post(`${API_URL}/api/jobs/${jobId}/save`);
  }

  async unsaveJob(jobId: string): Promise<void> {
    await axios.delete(`${API_URL}/api/jobs/${jobId}/save`);
  }
}

export const jobService = new JobService(); 