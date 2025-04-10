import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { profileService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, uploadProfilePhoto } from '../services/profile';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    jobType: '',
    skills: [],
    experience: '',
    education: '',
    languages: [],
    title: '',
    github_url: '',
    twitter_url: '',
    google_url: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        jobType: user.jobType || '',
        skills: user.skills || [],
        experience: user.experience || '',
        education: user.education || '',
        languages: user.languages || [],
        title: user.title || '',
        github_url: user.github_url || '',
        twitter_url: user.twitter_url || '',
        google_url: user.google_url || '',
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage],
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (languageToRemove) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((language) => language !== languageToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedUser = await updateProfile(profile);
      setUser(updatedUser);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (photo) {
      try {
        const formData = new FormData();
        formData.append('file', photo);
        const updatedUser = await uploadProfilePhoto(formData);
        setUser(updatedUser);
        setPhoto(null);
        setSnackbar({
          open: true,
          message: 'Profile photo updated successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setSnackbar({
          open: true,
          message: 'Error uploading profile photo',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              src={user?.profile_photo_url}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button variant="contained" component="span">
                Upload Photo
              </Button>
            </label>
            {photo && (
              <Button
                variant="contained"
                onClick={handlePhotoUpload}
                sx={{ ml: 2 }}
              >
                Save Photo
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Job Type</InputLabel>
                    <Select
                      name="jobType"
                      value={profile.jobType}
                      label="Preferred Job Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="remote">Remote</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                      <MenuItem value="office">Office</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      size="small"
                    />
                    <IconButton onClick={handleAddSkill} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Languages
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Language"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      size="small"
                    />
                    <IconButton onClick={handleAddLanguage} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.languages.map((language) => (
                      <Chip
                        key={language}
                        label={language}
                        onDelete={() => handleRemoveLanguage(language)}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="GitHub URL"
                    name="github_url"
                    value={profile.github_url}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Twitter URL"
                    name="twitter_url"
                    value={profile.twitter_url}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Google URL"
                    name="google_url"
                    value={profile.google_url}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Education"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Save Profile
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 