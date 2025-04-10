import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Find Your Dream Remote Job
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover remote job opportunities that match your skills and preferences.
          Let us help you find the perfect remote position.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/jobs"
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
          >
            Browse Jobs
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Create Your Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build your professional profile with your skills, experience, and preferences.
                Let employers find you.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/profile"
                startIcon={<PersonIcon />}
              >
                Create Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Job Alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified about new job opportunities that match your profile.
                Never miss a perfect opportunity.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/profile"
                startIcon={<NotificationsIcon />}
              >
                Set Up Alerts
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Easy Apply
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apply to multiple jobs with a single click. Save time and increase
                your chances of getting hired.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={RouterLink}
                to="/jobs"
                startIcon={<SearchIcon />}
              >
                Start Applying
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 