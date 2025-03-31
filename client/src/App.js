import Dashboard from './components/DashboardView/Dashboard';
import TableView from './components/TableView/TableView';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, CssBaseline, ThemeProvider } from '@mui/material';
import useDataStore from './store/useDataStore';
import { useEffect, useState } from 'react';
import { getTheme } from './theme/theme';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import HomePage from './components/HomePageView/HomePage';
import { CircularProgress, Box } from "@mui/material";
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tasks, fetchTasks } = useDataStore();
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1> Task Management App</h1>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color="inherit" href="/">Home</Button>
            <Button color="inherit" href="/dashboard">Dashboard</Button>
            <Button color="inherit" href="/table">Table View</Button>
            <Button onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </Button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table" element={<TableView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
