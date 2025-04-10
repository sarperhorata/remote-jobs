import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  OutlinedInput, 
  Button,
  Divider,
  Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const JobFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Available options for filters
  const experienceOptions = ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager'];
  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const companySizeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js', 
    'TypeScript', 'PHP', 'Ruby', 'Go', 'C#', 'AWS', 'Docker', 'Kubernetes',
    'DevOps', 'Machine Learning', 'Data Science', 'UI/UX', 'Graphic Design'
  ];
  
  const handleChange = (field) => (event) => {
    const newFilters = { ...localFilters, [field]: event.target.value };
    setLocalFilters(newFilters);
  };
  
  const handleSkillsChange = (event) => {
    const { value } = event.target;
    const newFilters = { ...localFilters, skills: typeof value === 'string' ? value.split(',') : value };
    setLocalFilters(newFilters);
  };
  
  const handleSalaryChange = (event, newValue) => {
    const newFilters = { ...localFilters, salaryRange: newValue };
    setLocalFilters(newFilters);
  };
  
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      location: '',
      experience: '',
      jobType: '',
      skills: [],
      companySize: '',
      salaryRange: [0, 200000]
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      <FilterSection>
        <TextField
          fullWidth
          label="Search Jobs"
          variant="outlined"
          value={localFilters.search}
          onChange={handleChange('search')}
          placeholder="Job title, company, or keywords"
        />
      </FilterSection>
      
      <FilterSection>
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          value={localFilters.location}
          onChange={handleChange('location')}
          placeholder="City, country, or remote"
        />
      </FilterSection>
      
      <FilterSection>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Experience Level</InputLabel>
          <Select
            value={localFilters.experience}
            onChange={handleChange('experience')}
            label="Experience Level"
          >
            <MenuItem value="">All Levels</MenuItem>
            {experienceOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>
      
      <FilterSection>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Job Type</InputLabel>
          <Select
            value={localFilters.jobType}
            onChange={handleChange('jobType')}
            label="Job Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {jobTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>
      
      <FilterSection>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Skills</InputLabel>
          <Select
            multiple
            value={localFilters.skills}
            onChange={handleSkillsChange}
            input={<OutlinedInput label="Skills" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {skillOptions.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>
      
      <FilterSection>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Company Size</InputLabel>
          <Select
            value={localFilters.companySize}
            onChange={handleChange('companySize')}
            label="Company Size"
          >
            <MenuItem value="">All Sizes</MenuItem>
            {companySizeOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterSection>
      
      <FilterSection>
        <Typography gutterBottom>Salary Range (USD)</Typography>
        <Slider
          value={localFilters.salaryRange || [0, 200000]}
          onChange={handleSalaryChange}
          valueLabelDisplay="auto"
          min={0}
          max={200000}
          step={10000}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">$0</Typography>
          <Typography variant="body2">$200k+</Typography>
        </Box>
      </FilterSection>
      
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default JobFilters; 