import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { JobDetail } from './components/JobDetail/JobDetail';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/" element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Remote Jobs</h1>
                <p>Welcome to Remote Jobs platform!</p>
                <p>Click <a href="/jobs/1">here</a> to view a sample job.</p>
              </div>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
