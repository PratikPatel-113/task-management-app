import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CompletedTasksChart = ({ data }) => {
    return (
        <Box width="30%" marginBottom={4} padding={2} border={1} borderRadius={2} borderColor="gray.300">
            <Typography variant="h6" align="center" gutterBottom>
                Completed Tasks Per Day
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="linear" dataKey="completedTasks" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CompletedTasksChart;
