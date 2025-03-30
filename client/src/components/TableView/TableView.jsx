import React, { useEffect, useState } from 'react';
import './TableView.css';

const TableView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tasks'); // Make sure this matches your server URL
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError('Failed to fetch tasks');
        console.error(error);
      } finally {
        setLoading(false); // Always set loading to false after data fetch
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching
  }

  if (error) {
    return <div>{error}</div>; // Display error message if the request fails
  }

  return (
    <div className="table-container">
      <h1>Task Table View</h1>

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
          {tasks.map((task, index) => (
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