import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Pagination, CircularProgress } from '@mui/material';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobService';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experience: '',
    jobType: '',
    skills: [],
    companySize: '',
    salaryRange: ''
  });

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobs(page, filters);
        setJobs(response.jobs);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Remote Job Listings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filters Panel */}
        <Grid item xs={12} md={3}>
          <JobFilters filters={filters} onFilterChange={handleFilterChange} />
        </Grid>
        
        {/* Job Listings */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : jobs.length > 0 ? (
            <>
              <Box mb={3}>
                <Typography variant="body1">
                  Showing {jobs.length} jobs
                </Typography>
              </Box>
              
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1" align="center">
              No jobs found matching your criteria.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobListings; 