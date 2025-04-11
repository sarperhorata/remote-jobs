import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as SalaryIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { jobService } from '../services/jobService';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch job details
        const jobData = await jobService.fetchJobById(id);
        setJob(jobData);
        
        // Check if job is saved
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const savedJobs = await jobService.getSavedJobs();
            setIsSaved(savedJobs.some(savedJob => savedJob.id === id));
          } catch (error) {
            console.error("Error checking saved status:", error);
          }
        }
        
        // Fetch similar jobs
        try {
          const similarJobsData = await jobService.fetchSimilarJobs(id);
          setSimilarJobs(similarJobsData.slice(0, 5)); // Limit to 5 similar jobs
        } catch (error) {
          console.error("Error fetching similar jobs:", error);
          setSimilarJobs([]);
        }
        
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(error.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id]);
  
  const handleSaveJob = async () => {
    try {
      setSaveLoading(true);
      if (isSaved) {
        await jobService.removeSavedJob(id);
        setIsSaved(false);
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      // Show error notification
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    const title = job ? `${job.title} at ${job.company}` : 'Job Listing';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url);
      // Show notification that URL was copied
    }
  };
  
  const handleApply = () => {
    window.open(job.applicationUrl, '_blank');
    
    // Track application in analytics or user history
    // This could also open a modal with auto-fill options for premium users
  };
  
  const handleBackToJobs = () => {
    navigate('/jobs');
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString || 'N/A';
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToJobs}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }
  
  if (!job) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Job not found</Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToJobs}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button 
        variant="text" 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackToJobs}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>
      
      <Grid container spacing={3}>
        {/* Main content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Company logo and job header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={job.companyLogo} 
                alt={job.company} 
                sx={{ width: 64, height: 64, mr: 2 }}
              >
                {job.company ? job.company.charAt(0) : 'J'}
              </Avatar>
              <Box>
                <Typography variant="h4">{job.title}</Typography>
                <Typography variant="h6" color="text.secondary">
                  {job.company}
                </Typography>
              </Box>
            </Box>
            
            {/* Job metadata */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {job.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{job.location}</Typography>
                </Box>
              )}
              
              {job.jobType && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{job.jobType}</Typography>
                </Box>
              )}
              
              {job.salary && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SalaryIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{job.salary}</Typography>
                </Box>
              )}
              
              {job.postedDate && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Posted: {formatDate(job.postedDate)}</Typography>
                </Box>
              )}
            </Box>
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleApply}
              >
                Apply Now
              </Button>
              
              <Button 
                variant={isSaved ? "outlined" : "contained"}
                color={isSaved ? "success" : "secondary"}
                onClick={handleSaveJob}
                disabled={saveLoading}
                startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              >
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              
              <Tooltip title="Share">
                <IconButton onClick={handleShare} color="primary">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Job tags/categories */}
            {job.tags && job.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {job.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            {/* Job description */}
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: job.description }} />
            
            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Responsibilities</Typography>
                <List disablePadding>
                  {job.responsibilities.map((item, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Requirements</Typography>
                <List disablePadding>
                  {job.requirements.map((item, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Benefits</Typography>
                <List disablePadding>
                  {job.benefits.map((item, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Required Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {job.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      color="secondary" 
                      variant="outlined"
                      onClick={() => navigate(`/jobs?skill=${skill}`)}
                    />
                  ))}
                </Box>
              </>
            )}
            
            {/* Company info */}
            {job.companyDescription && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>About {job.company}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body1" paragraph>{job.companyDescription}</Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Job summary card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Job Summary</Typography>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Title" 
                    secondary={job.title} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Company" 
                    secondary={job.company} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                {job.location && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="Location" 
                      secondary={job.location} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                {job.jobType && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="Job Type" 
                      secondary={job.jobType} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                {job.salary && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="Salary" 
                      secondary={job.salary} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
                {job.postedDate && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="Posted Date" 
                      secondary={formatDate(job.postedDate)} 
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
              </List>
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Similar jobs */}
          {similarJobs.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Similar Jobs</Typography>
                <List disablePadding>
                  {similarJobs.map((similarJob) => (
                    <React.Fragment key={similarJob.id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                        sx={{ px: 0 }}
                      >
                        <ListItemText 
                          primary={similarJob.title} 
                          secondary={`${similarJob.company}${similarJob.location ? ` • ${similarJob.location}` : ''}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="text" 
                    color="primary"
                    onClick={() => navigate('/jobs', { state: { fromSimilar: true, skills: job.skills } })}
                  >
                    View More Similar Jobs
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetail; 