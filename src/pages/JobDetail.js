import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Work,
  AttachMoney,
  AccessTime,
  Share,
  Bookmark,
  BookmarkBorder,
  ArrowBack
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import jobService from '../services/jobService';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.fetchJobById(id);
        setJob(jobData);
        
        if (jobData.skills) {
          const similar = await jobService.fetchSimilarJobs(id, jobData.skills);
          setSimilarJobs(similar);
        }
      } catch (err) {
        setError('Job not found');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const handleSave = async () => {
    try {
      if (saved) {
        await jobService.removeSavedJob(id);
        setSaved(false);
        setSnackbar({
          open: true,
          message: 'Job removed from saved jobs',
          severity: 'info'
        });
      } else {
        await jobService.saveJob(id);
        setSaved(true);
        setSnackbar({
          open: true,
          message: 'Job saved successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error saving job',
        severity: 'error'
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({
          open: true,
          message: 'Link copied to clipboard',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleApply = () => {
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/jobs')}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/jobs')}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={job.company_logo}
                alt={job.company}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h4" component="h1">
                  {job.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {job.company}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} mb={3}>
              <Chip
                icon={<LocationOn />}
                label={job.location}
                variant="outlined"
              />
              <Chip
                icon={<Work />}
                label={job.job_type}
                variant="outlined"
              />
              {job.salary && (
                <Chip
                  icon={<AttachMoney />}
                  label={job.salary}
                  variant="outlined"
                />
              )}
              <Chip
                icon={<AccessTime />}
                label={`Posted ${formatDistanceToNow(new Date(job.posted_at))} ago`}
                variant="outlined"
              />
            </Box>

            <Box display="flex" gap={2} mb={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                fullWidth
              >
                Apply Now
              </Button>
              <IconButton onClick={handleSave}>
                {saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Box>

            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography paragraph>{job.description}</Typography>

            {job.responsibilities && (
              <>
                <Typography variant="h6" gutterBottom>
                  Responsibilities
                </Typography>
                <List>
                  {job.responsibilities.map((item, index) => (
                    <ListItem key={index}>
                      <Typography>• {item}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {job.requirements && (
              <>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <List>
                  {job.requirements.map((item, index) => (
                    <ListItem key={index}>
                      <Typography>• {item}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {job.benefits && (
              <>
                <Typography variant="h6" gutterBottom>
                  Benefits
                </Typography>
                <List>
                  {job.benefits.map((item, index) => (
                    <ListItem key={index}>
                      <Typography>• {item}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {job.skills && (
              <>
                <Typography variant="h6" gutterBottom>
                  Required Skills
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {job.skills.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Summary
              </Typography>
              <List>
                <ListItem>
                  <Typography>
                    <strong>Job Type:</strong> {job.job_type}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    <strong>Location:</strong> {job.location}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>
                    <strong>Posted:</strong>{' '}
                    {formatDistanceToNow(new Date(job.posted_at))} ago
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {similarJobs.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Similar Jobs
                </Typography>
                <List>
                  {similarJobs.map((similarJob) => (
                    <ListItem
                      key={similarJob.id}
                      button
                      onClick={() => navigate(`/jobs/${similarJob.id}`)}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {similarJob.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {similarJob.company}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobDetail; 