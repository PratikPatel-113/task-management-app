import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useDataStore from '../../store/useDataStore';
import CompletedTasksChart from './CompletedTasksChart';
import DueTasksChart from './DueTasksChart';
import EstimationHoursChart from './EstimationHoursChart';
import { getCompletedPerDay, getDueDatePerDay, getEstimationHoursBreakdown } from '../../utils/dashboardUtils';

const Dashboard = () => {
    const tasks = useDataStore((state) => state.tasks);
    const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6666'];

    const [completedTasksData, setCompletedTasksData] = useState(null);
    const [dueTasksData, setDueTasksData] = useState(null);
    const [estimationHoursData, setEstimationHoursData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setLoading(true);

            setCompletedTasksData(getCompletedPerDay(tasks));
            setDueTasksData(getDueDatePerDay(tasks));
            setEstimationHoursData(getEstimationHoursBreakdown(tasks));

            setLoading(false);
        } catch (err) {
            setError('Failed to load data.');
            setLoading(false);
        }
    }, [tasks]);

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                Dashboard
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                    {/* Graph 1: Completed Tasks Per Day */}
                    <CompletedTasksChart data={completedTasksData.length ? completedTasksData : [{ date: '', count: 0 }]} />

                    {/* Graph 2: Due Date Per Day */}
                    <DueTasksChart data={dueTasksData.length ? dueTasksData : [{ date: '', count: 0 }]} />

                    {/* Graph 3: Estimation Hours Breakdown (Pie Chart) */}
                    <EstimationHoursChart data={estimationHoursData.length ? estimationHoursData : [{ name: 'No Data', value: 1 }]} colors={pieChartColors} />
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;