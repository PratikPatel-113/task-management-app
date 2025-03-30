import './App.css';
import Dashboard from './components/DashboardView/Dashboard';
import TableView from './components/TableView/TableView';

const App = () => {
  return (
    <div className="App">
      <h1> Welcome to Task Management App</h1>
      <TableView />
      <Dashboard />
    </div>
  );
}

export default App;
