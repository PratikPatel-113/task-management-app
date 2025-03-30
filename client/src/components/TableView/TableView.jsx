import React, { useEffect, useState } from 'react';
import { Drawer, Button } from '@mui/material';
import './TableView.css';
import useDataStore from '../../store/useDataStore';

const TableView = () => {
  const tasks = useDataStore((state) => state.tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    filterTasks();
  }, [searchQuery, selectedStatus]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  }

  const handleFilterStatus = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedTask(null);
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
            <tr key={task.id} onClick={() => handleRowClick(task)}>
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

      {/* Drawer for Task Details */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleCloseDrawer}
      >
        <div style={{ width: 400, padding: '20px' }}>
          {/* Close Button */}
          <Button
            variant="outlined"
            onClick={handleCloseDrawer}
            style={{ marginBottom: '20px', float: 'right' }}
          >
            Close
          </Button>
          {selectedTask && (
            <>
              <h1>Task Details</h1>
              <div><strong>Task Name:</strong> {selectedTask.name}</div>
              <div><strong>Task ID:</strong> {selectedTask.id}</div>
              <div><strong>Description:</strong> {selectedTask.description}</div>
              <div><strong>Assignee:</strong> {selectedTask.assignee}</div>
              <div><strong>Status:</strong> {selectedTask.status}</div>
              <div><strong>Due Date:</strong> {selectedTask.dueDate}</div>

              {/* Comments Section */}
              <div style={{ marginTop: '20px' }}><strong>Comments:</strong></div>
              <textarea
                rows={5}
                placeholder="No comments available."
                style={{
                  resize: 'none',
                  marginTop: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '14px'
                }}
                disabled
              />
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default TableView