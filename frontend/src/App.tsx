import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, 
  Card, CardContent, Grid, Chip, Paper, List, ListItem,
  ListItemText, CircularProgress
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { JobDetail } from './components/JobDetail/JobDetail';

// Mock data for development
const MOCK_API_ENABLED = true; // Set to false when backend is ready

// Mock job data
const mockJob = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  companyLogo: 'https://via.placeholder.com/100',
  location: 'Remote (Worldwide)',
  salary: '$120k - $150k',
  jobType: 'Full-time',
  postedDate: '2025-03-15',
  description: '<p>We are seeking an experienced Frontend Developer to join our team...</p>',
  requirements: [
    'At least 5 years of experience with React',
    'Strong TypeScript skills',
    'Experience with modern frontend frameworks',
    'Knowledge of CI/CD workflows'
  ],
  responsibilities: [
    'Develop new user-facing features',
    'Build reusable components and front-end libraries',
    'Translate designs into high quality code',
    'Optimize components for maximum performance'
  ],
  benefits: [
    'Competitive salary',
    'Flexible working hours',
    'Remote work options',
    'Health insurance'
  ],
  skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
  companyDescription: 'TechCorp is a leading software development company specializing in creating innovative solutions for enterprises.',
  applicationUrl: 'https://example.com/apply'
};

// Mock similar jobs
const mockSimilarJobs = [
  {
    id: '2',
    title: 'React Developer',
    company: 'WebSolutions',
    location: 'Remote (Europe)'
  },
  {
    id: '3',
    title: 'Frontend Engineer',
    company: 'StartupX',
    location: 'Remote (US)'
  },
  {
    id: '4',
    title: 'UI Developer',
    company: 'DesignStudio',
    location: 'Remote (Asia)'
  }
];

// Create a mock API override
if (MOCK_API_ENABLED) {
  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    
    // Mock job endpoints
    if (url.includes('/api/jobs/1')) {
      return new Response(JSON.stringify(mockJob), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } else if (url.includes('/api/jobs/1/similar')) {
      return new Response(JSON.stringify(mockSimilarJobs), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Fall back to normal fetch for other URLs
    return originalFetch(input, init);
  };
  
  // Also mock axios by overriding XHR
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    
    // Override the open method to intercept requests
    const originalOpen = xhr.open;
    xhr.open = function(method, url, ...rest) {
      const mockResponse = (response) => {
        Object.defineProperty(xhr, 'response', { get: () => JSON.stringify(response) });
        Object.defineProperty(xhr, 'responseText', { get: () => JSON.stringify(response) });
        Object.defineProperty(xhr, 'status', { value: 200 });
        Object.defineProperty(xhr, 'readyState', { value: 4 });
        xhr.dispatchEvent(new Event('load'));
      };
      
      if (url.includes('/api/jobs/1') && !url.includes('similar')) {
        // Intercept job detail API call
        setTimeout(() => mockResponse(mockJob), 200);
        return;
      } else if (url.includes('/api/jobs/1/similar')) {
        // Intercept similar jobs API call
        setTimeout(() => mockResponse(mockSimilarJobs), 200);
        return;
      }
      
      // Regular XHR for other URLs
      return originalOpen.call(xhr, method, url, ...rest);
    };
    
    return xhr;
  };
}

// Create a client
const queryClient = new QueryClient();

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Demo Pages
const HomePage = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h3" gutterBottom>
      Remote Jobs Platform
    </Typography>
    <Typography variant="subtitle1" gutterBottom>
      Find the best remote jobs worldwide
    </Typography>
    
    <Grid container spacing={3} sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Available Pages</Typography>
          <List>
            <ListItem button component={Link} to="/jobs/1">
              <ListItemText 
                primary="Job Detail Page" 
                secondary="View detailed information about a job posting" 
              />
            </ListItem>
            <ListItem button component={Link} to="/jobs">
              <ListItemText 
                primary="Jobs List" 
                secondary="Browse all available jobs" 
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Featured Job</Typography>
          <Card>
            <CardContent>
              <Typography variant="h6">{mockJob.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {mockJob.company}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={mockJob.location} size="small" />
                <Chip label={mockJob.jobType} size="small" />
              </Box>
              <Button 
                variant="contained" 
                component={Link} 
                to="/jobs/1"
                sx={{ mt: 2 }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Paper>
      </Grid>
    </Grid>
  </Container>
);

const JobsList = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>
      Browse Jobs
    </Typography>
    
    <Box sx={{ mb: 3 }}>
      <Button variant="outlined" component={Link} to="/">
        Back to Home
      </Button>
    </Box>
    
    <Grid container spacing={3}>
      {[mockJob, ...mockSimilarJobs].map((job) => (
        <Grid item xs={12} md={6} lg={4} key={job.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2">
                {job.title}
              </Typography>
              <Typography color="text.secondary">
                {job.company}
              </Typography>
              <Box sx={{ mt: 2, mb: 1.5 }}>
                <Chip 
                  label={job.location} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              </Box>
              <Button 
                component={Link} 
                to={`/jobs/${job.id}`}
                variant="contained" 
                size="small"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  Remote Jobs
                </Link>
              </Typography>
              <Button color="inherit" component={Link} to="/jobs">
                Browse Jobs
              </Button>
              <Button color="inherit" component={Link} to="/jobs/1">
                Sample Job
              </Button>
            </Toolbar>
          </AppBar>
          
          <Routes>
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
