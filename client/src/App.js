import Dashboard from './components/DashboardView/Dashboard';
import TableView from './components/TableView/TableView';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, CssBaseline, ThemeProvider } from '@mui/material';
import useDataStore from './store/useDataStore';
import { useEffect, useState } from 'react';
import { getTheme } from './theme/theme';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setTasks = useDataStore((state) => state.setTasks);
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError('Failed to fetch tasks');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
          <Route path="/" element={<h1 style={{ textAlign: 'center' }}> This is Home Page</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/table" element={<TableView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
