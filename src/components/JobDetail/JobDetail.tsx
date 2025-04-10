import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Box,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  BookmarkBorder,
  Bookmark,
  LocationOn,
  Business,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { jobService } from '../../services/jobService';

interface JobDetailProps {
  onSaveJob?: (jobId: string) => void;
  onUnsaveJob?: (jobId: string) => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ onSaveJob, onUnsaveJob }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = React.useState(false);

  const { data: job, isLoading, error } = useQuery(['job', id], () => jobService.fetchJobById(id!));
  const { data: similarJobs } = useQuery(
    ['similarJobs', id],
    () => jobService.fetchSimilarJobs(id!),
    { enabled: !!job }
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.company}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleSaveToggle = () => {
    if (id) {
      if (isSaved) {
        onUnsaveJob?.(id);
        setIsSaved(false);
      } else {
        onSaveJob?.(id);
        setIsSaved(true);
      }
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="rectangular" height={400} sx={{ mt: 4 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading job details. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back to Jobs
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <img
                    src={job.companyLogo || '/default-company-logo.png'}
                    alt={`${job.company} logo`}
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" component="h1">
                    {job.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary" data-testid="company-name">
                      <Business sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      {job.company}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" data-testid="job-location">
                      <LocationOn sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      {job.location}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      <AccessTime sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      {format(new Date(job.postedDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <IconButton onClick={handleShare} aria-label="share" data-testid="share-button">
                    <Share />
                  </IconButton>
                  <IconButton 
                    onClick={handleSaveToggle} 
                    aria-label="save" 
                    data-testid="save-button"
                    aria-pressed={isSaved}
                  >
                    {isSaved ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Job Description
                </Typography>
                <Typography variant="body1" paragraph data-testid="job-description">
                  {job.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Responsibilities
                </Typography>
                <Typography variant="body1" component="div" data-testid="responsibilities">
                  <ul>
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Typography variant="body1" component="div" data-testid="requirements">
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Benefits
                </Typography>
                <Typography variant="body1" component="div" data-testid="benefits">
                  <ul>
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </Typography>

                <Box sx={{ mt: 2 }} data-testid="skills">
                  <Typography variant="h6" gutterBottom>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.skills.map((skill, index) => (
                      <Chip key={index} label={skill} data-testid="skill-chip" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Job Summary Card */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <AttachMoney sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Salary: {job.salary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <AccessTime sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Job Type: {job.type}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {/* Handle apply */}}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          <Card data-testid="similar-jobs">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Similar Jobs
              </Typography>
              {similarJobs?.map((similarJob) => (
                <Box
                  key={similarJob.id}
                  data-testid="similar-job-card"
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {similarJob.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {similarJob.company} • {similarJob.location}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate(`/jobs/${similarJob.id}`)}
                    sx={{ mt: 1 }}
                  >
                    View Details
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}; 