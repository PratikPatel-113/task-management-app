import React from 'react';
import { Box, Typography } from '@mui/material';
import useDataStore from '../../store/useDataStore';
import CompletedTasksChart from './CompletedTasksChart';
import DueTasksChart from './DueTasksChart';
import EstimationHoursChart from './EstimationHoursChart';
import { getCompletedPerDay, getDueDatePerDay, getEstimationHoursBreakdown } from '../../utils/dashboardUtils';

const Dashboard = () => {
    const tasks = useDataStore((state) => state.tasks);
    const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6666'];

    return (
        <Box padding={3}>
            <Typography variant="h4" align="center" gutterBottom>
                Dashboard
            </Typography>

            {/* Graphs in a Row with Frames */}
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                {/* Graph 1: Completed Tasks Per Day */}
                <CompletedTasksChart data={getCompletedPerDay(tasks)} />

                {/* Graph 2: Due Date Per Day */}
                <DueTasksChart data={getDueDatePerDay(tasks)} />

                {/* Graph 3: Estimation Hours Breakdown (Pie Chart) */}
                <EstimationHoursChart data={getEstimationHoursBreakdown(tasks)} colors={pieChartColors} />            </Box>
        </Box>
    )
}

export default Dashboard