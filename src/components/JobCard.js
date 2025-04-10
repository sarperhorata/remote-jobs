import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Avatar,
  Divider
} from '@mui/material';
import { 
  LocationOn, 
  Work, 
  AccessTime, 
  AttachMoney 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const {
    id,
    title,
    company,
    companyLogo,
    location,
    jobType,
    salary,
    postedAt,
    skills,
    description
  } = job;
  
  // Format the posted date
  const formattedDate = formatDistanceToNow(new Date(postedAt), { addSuffix: true });
  
  // Truncate description
  const truncatedDescription = description 
    ? description.length > 150 
      ? `${description.substring(0, 150)}...` 
      : description
    : '';
  
  return (
    <Card sx={{ mb: 2, boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            src={companyLogo} 
            alt={company}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {company}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip 
            icon={<LocationOn />} 
            label={location} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<Work />} 
            label={jobType} 
            size="small" 
            variant="outlined" 
          />
          {salary && (
            <Chip 
              icon={<AttachMoney />} 
              label={salary} 
              size="small" 
              variant="outlined" 
            />
          )}
          <Chip 
            icon={<AccessTime />} 
            label={formattedDate} 
            size="small" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncatedDescription}
        </Typography>
        
        {skills && skills.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Skills:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {skills.slice(0, 5).map((skill) => (
                <Chip 
                  key={skill} 
                  label={skill} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
              {skills.length > 5 && (
                <Chip 
                  label={`+${skills.length - 5} more`} 
                  size="small" 
                  variant="outlined" 
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button 
          component={Link} 
          to={`/jobs/${id}`} 
          color="primary"
        >
          View Details
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to={`/jobs/${id}/apply`}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard; 