import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DueTasksChart = ({ data }) => {
    return (
        <Box width="30%" marginBottom={4} padding={2} border={1} borderRadius={2} borderColor="gray.300">
            <Typography variant="h6" align="center" gutterBottom>
                Tasks Due Per Day
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="linear" dataKey="tasksDue" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default DueTasksChart;
