// server.js
const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for all origins (allow all domains)
app.use(cors());

// Dummy task data
const tasks = [
    { id: 1, name: 'Buy groceries', description: 'Buy milk, eggs, and bread', assignee: 'John Doe', status: 'Completed', dueDate: '2025-03-31', estimatedHours: 1 },
    { id: 2, name: 'Clean the house', description: 'Dust and vacuum all rooms', assignee: 'Jane Doe', status: 'Pending', dueDate: '2025-04-05', estimatedHours: 3 },
    { id: 3, name: 'Finish project report', description: 'Complete the final draft of the project report', assignee: 'Emily Clark', status: 'Pending', dueDate: '2025-04-02', estimatedHours: 6 },
    { id: 4, name: 'Call the bank', description: 'Ask about mortgage rates', assignee: 'Michael Smith', status: 'Completed', dueDate: '2025-04-01', estimatedHours: 0.5 },
    { id: 5, name: 'Pay bills', description: 'Pay electricity and water bills', assignee: 'David Johnson', status: 'Overdue', dueDate: '2025-04-03', estimatedHours: 1 },

    { id: 6, name: 'Attend meeting with client', description: 'Discuss project details', assignee: 'Alice Green', status: 'Completed', dueDate: '2025-03-31', estimatedHours: 2 },
    { id: 7, name: 'Complete tax filing', description: 'File taxes for the year', assignee: 'Bob White', status: 'Pending', dueDate: '2025-04-05', estimatedHours: 8 },
    { id: 8, name: 'Fix broken sink', description: 'Repair the sink in the kitchen', assignee: 'Charlie Brown', status: 'Completed', dueDate: '2025-03-30', estimatedHours: 2 },
    { id: 9, name: 'Prepare presentation for conference', description: 'Prepare slides and talk', assignee: 'Diana Prince', status: 'Completed', dueDate: '2025-04-01', estimatedHours: 4 },
    { id: 10, name: 'Submit expense reports', description: 'Submit monthly expenses to HR', assignee: 'Eve Adams', status: 'Completed', dueDate: '2025-04-02', estimatedHours: 1 },

    { id: 11, name: 'Plan team outing', description: 'Organize team bonding event', assignee: 'Frank Hill', status: 'Completed', dueDate: '2025-03-30', estimatedHours: 3 },
    { id: 12, name: 'Organize files and folders', description: 'Digitally organize company files', assignee: 'Grace Lee', status: 'Completed', dueDate: '2025-04-03', estimatedHours: 5 },
    { id: 13, name: 'Prepare for performance review', description: 'Prepare documents for upcoming review', assignee: 'Hank Morgan', status: 'Pending', dueDate: '2025-04-06', estimatedHours: 3 },
    { id: 14, name: 'Update website content', description: 'Make updates to the homepage', assignee: 'Ivy Clarke', status: 'Completed', dueDate: '2025-04-01', estimatedHours: 2 },
    { id: 15, name: 'Buy office supplies', description: 'Restock printer paper and pens', assignee: 'Jack James', status: 'Overdue', dueDate: '2025-03-29', estimatedHours: 0.5 },

    { id: 16, name: 'Install new software', description: 'Install latest security software', assignee: 'Kathy White', status: 'Completed', dueDate: '2025-04-01', estimatedHours: 4 },
    { id: 17, name: 'Review employee performance', description: 'Review the quarterly performance of employees', assignee: 'Leo Scott', status: 'Completed', dueDate: '2025-03-31', estimatedHours: 2 },
    { id: 18, name: 'Create marketing campaign', description: 'Plan and create new campaign for product launch', assignee: 'Mia Turner', status: 'Pending', dueDate: '2025-04-07', estimatedHours: 7 },
    { id: 19, name: 'Conduct job interview', description: 'Interview candidate for developer position', assignee: 'Noah Brooks', status: 'Completed', dueDate: '2025-03-30', estimatedHours: 3 },
    { id: 20, name: 'Update social media', description: 'Post updates on company social media accounts', assignee: 'Olivia Davis', status: 'Completed', dueDate: '2025-04-02', estimatedHours: 1 }
];

// Generate more tasks dynamically till id 50
for (let i = 21; i <= 500; i++) {
    tasks.push({
        id: i,
        name: `Task ${i}`,
        description: `Description for task ${i}`,
        assignee: `Assignee ${i}`,
        status: ['Pending', 'Completed', 'Overdue'][i % 3],
        dueDate: `2025-04-${String(i % 30 + 1).padStart(2, '0')}`,
        estimatedHours: (i % 8) + 1
    });
}

// Set up a GET endpoint to fetch tasks
app.get('/api/tasks', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = tasks.slice(startIndex, endIndex);
    const hasMore = endIndex < tasks.length;

    res.json({ tasks: paginatedTasks, hasMore });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
