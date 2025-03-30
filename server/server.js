// server.js
const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const app = express();
const port = 8000;

// Enable CORS for all origins (allow all domains)
app.use(cors());

// Dummy task data
const tasks = [
    { id: 1, name: 'Buy groceries', description: 'Buy milk, eggs, and bread', assignee: 'John Doe', status: 'Completed', dueDate: '2025-03-31' },
    { id: 2, name: 'Clean the house', description: 'Dust and vacuum all rooms', assignee: 'Jane Doe', status: 'Pending', dueDate: '2025-04-05' },
    { id: 3, name: 'Finish project report', description: 'Complete the final draft of the project report', assignee: 'Emily Clark', status: 'Pending', dueDate: '2025-04-02' },
    { id: 4, name: 'Call the bank', description: 'Ask about mortgage rates', assignee: 'Michael Smith', status: 'Completed', dueDate: '2025-04-01' },
    { id: 5, name: 'Pay bills', description: 'Pay electricity and water bills', assignee: 'David Johnson', status: 'Overdue', dueDate: '2025-04-03' }
];

// Set up a GET endpoint to fetch tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks); // Respond with the dummy tasks data as JSON
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
