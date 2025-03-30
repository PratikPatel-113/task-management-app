import React, { useEffect, useState } from 'react';
import './TableView.css';

const TableView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);

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

  useEffect(() => {
    filterTasks();
  }, [searchQuery, selectedStatus, tasks]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  }

  const handleFilterStatus = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((task) => {
        return (
          task.name.toLowerCase().includes(searchQuery) ||
          task.description.toLowerCase().includes(searchQuery) ||
          task.assignee.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    setFilteredTasks(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="table-container">
      <h1>Task Table View</h1>

      <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <select value={selectedStatus} onChange={handleFilterStatus}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Table component */}
      <table className="table">
        <thead>
          <tr>
            <th>Row No</th>
            <th>Task Name</th>
            <th>Task ID</th>
            <th>Description</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id}>
              <td>{index + 1}</td>
              <td>{task.name}</td>
              <td>{task.id}</td>
              <td>{task.description}</td>
              <td>{task.assignee}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView