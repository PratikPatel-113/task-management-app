import Dashboard from './components/DashboardView/Dashboard';
import TableView from './components/TableView/TableView';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import './App.css';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1> Task Management App</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/dashboard">Dashboard</Button>
          <Button color="inherit" href="/table">Table View</Button>
        </div>

      </div>

      <Routes>
        <Route path="/" element={<h1 style={{ textAlign: 'center' }}> This is Home Page</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/table" element={<TableView />} />
      </Routes>
    </Router >
  );
}

export default App;
