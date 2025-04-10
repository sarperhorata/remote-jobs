import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Bookmark,
  BookmarkBorder,
  LocationOn,
  Work,
  AttachMoney,
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { jobService, Job } from '../../services/jobService';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const { data: job, isLoading, error } = useQuery<Job>(
    ['job', id],
    () => jobService.fetchJobById(id!),
    { enabled: !!id }
  );

  const { data: similarJobs } = useQuery<Job[]>(
    ['similarJobs', id],
    () => jobService.fetchSimilarJobs(id!),
    { enabled: !!id }
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleSaveJob = async () => {
    if (!job) return;
    try {
      if (savedJobs.includes(job.id)) {
        await jobService.unsaveJob(job.id);
        setSavedJobs(savedJobs.filter(id => id !== job.id));
      } else {
        await jobService.saveJob(job.id);
        setSavedJobs([...savedJobs, job.id]);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/jobs')}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {job.companyLogo && (
                  <Box
                    component="img"
                    src={job.companyLogo}
                    alt={job.company}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                )}
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {job.company}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  icon={<LocationOn />}
                  label={job.location}
                  variant="outlined"
                />
                <Chip
                  icon={<Work />}
                  label={job.type}
                  variant="outlined"
                />
                <Chip
                  icon={<AttachMoney />}
                  label={job.salary}
                  variant="outlined"
                />
                <Chip
                  icon={<AccessTime />}
                  label={format(new Date(job.postedDate), 'MMM d, yyyy')}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Apply Now
                </Button>
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
                <IconButton onClick={handleSaveJob}>
                  {savedJobs.includes(job.id) ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>

              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography paragraph>{job.description}</Typography>

              <Typography variant="h6" gutterBottom>
                Responsibilities
              </Typography>
              <ul>
                {job.responsibilities.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography paragraph>{item}</Typography>
                  </li>
                ))}
              </ul>

              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <ul>
                {job.requirements.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography paragraph>{item}</Typography>
                  </li>
                ))}
              </ul>

              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              <ul>
                {job.benefits.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography paragraph>{item}</Typography>
                  </li>
                ))}
              </ul>

              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {job.skills.map((skill: string, index: number) => (
                  <Chip key={index} label={skill} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography>{job.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Job Type
                  </Typography>
                  <Typography>{job.type}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Salary
                  </Typography>
                  <Typography>{job.salary}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted Date
                  </Typography>
                  <Typography>
                    {format(new Date(job.postedDate), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Similar Jobs
              </Typography>
              <Divider sx={{ my: 2 }} />
              {similarJobs?.map((similarJob) => (
                <Box
                  key={similarJob.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/jobs/${similarJob.id}`)}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {similarJob.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {similarJob.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {similarJob.location} • {similarJob.type}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}; 