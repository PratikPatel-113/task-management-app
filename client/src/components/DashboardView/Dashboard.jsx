import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend, Tooltip as PieTooltip } from 'recharts';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6666'];

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

    // Helper function to format date
    const formatDate = (date) => new Date(date).toLocaleDateString();

    // 1. Completed per Day (Line Chart)
    const completedPerDay = () => {
        const completedData = tasks.filter(task => task.status === 'Completed');

        const countByDate = completedData.reduce((acc, task) => {
            const date = formatDate(task.dueDate);
            acc[date] = acc[date] ? acc[date] + 1 : 1;
            return acc;
        }, {});

        const data = Object.entries(countByDate).map(([date, count]) => ({
            date,
            completedTasks: count
        }));

        return data;
    };

    // 2. Due Date per Day (Line Chart)
    const dueDatePerDay = () => {
        const tasksWithDueDate = tasks.filter(task => task.dueDate);

        const countByDate = tasksWithDueDate.reduce((acc, task) => {
            const date = formatDate(task.dueDate);
            acc[date] = acc[date] ? acc[date] + 1 : 1;
            return acc;
        }, {});

        const data = Object.entries(countByDate).map(([date, count]) => ({
            date,
            tasksDue: count
        }));

        return data;
    };

    // 3. Estimation Hours (Pie Chart)
    const estimationHoursBreakdown = () => {
        const ranges = {
            '0-1 hours': 0,
            '1-3 hours': 0,
            '3-5 hours': 0,
            '5-10 hours': 0,
            '10+ hours': 0
        };

        tasks.forEach(task => {
            const estimation = task.estimatedHours;

            if (estimation <= 1) {
                ranges['0-1 hours']++;
            } else if (estimation > 1 && estimation <= 3) {
                ranges['1-3 hours']++;
            } else if (estimation > 3 && estimation <= 5) {
                ranges['3-5 hours']++;
            } else if (estimation > 5 && estimation <= 10) {
                ranges['5-10 hours']++;
            } else {
                ranges['10+ hours']++;
            }
        });

        return Object.entries(ranges).map(([range, count]) => ({
            range,
            count
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                Dashboard
            </Typography>

            {/* Graphs in a Row with Frames */}
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                {/* Graph 1: Completed Tasks Per Day */}
                <Box width="30%" marginBottom={4} padding={2} border={1} borderRadius={2} borderColor="gray.300">
                    <Typography variant="h6" align="center" gutterBottom>
                        Completed Tasks Per Day
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={completedPerDay()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="linear" dataKey="completedTasks" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Graph 2: Due Date Per Day */}
                <Box width="30%" marginBottom={4} padding={2} border={1} borderRadius={2} borderColor="gray.300">
                    <Typography variant="h6" align="center" gutterBottom>
                        Tasks Due Per Day
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dueDatePerDay()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="linear" dataKey="tasksDue" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Graph 3: Estimation Hours Breakdown (Pie Chart) */}
                <Box width="30%" marginBottom={4} padding={2} border={1} borderRadius={2} borderColor="gray.300" display="flex" justifyContent="space-between" alignItems="center">
                    <Box width="70%">
                        <Typography variant="h6" align="center" gutterBottom>
                            Estimation Hours Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={estimationHoursBreakdown()}
                                    dataKey="count"
                                    nameKey="range"
                                    outerRadius={120}
                                    fill="#8884d8"
                                >
                                    {estimationHoursBreakdown().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieChartColors[index]} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Pie Chart Ranges */}
                    <Box width="25%" padding={2}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Task Duration Ranges
                        </Typography>
                        <Box>
                            <Typography variant="body1">0-1 hours: {estimationHoursBreakdown().find(item => item.range === '0-1 hours')?.count || 0}</Typography>
                            <Typography variant="body1">1-3 hours: {estimationHoursBreakdown().find(item => item.range === '1-3 hours')?.count || 0}</Typography>
                            <Typography variant="body1">3-5 hours: {estimationHoursBreakdown().find(item => item.range === '3-5 hours')?.count || 0}</Typography>
                            <Typography variant="body1">5-10 hours: {estimationHoursBreakdown().find(item => item.range === '5-10 hours')?.count || 0}</Typography>
                            <Typography variant="body1">10+ hours: {estimationHoursBreakdown().find(item => item.range === '10+ hours')?.count || 0}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard