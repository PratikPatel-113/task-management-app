// Helper function to format date
export const formatDate = (date) => new Date(date).toLocaleDateString();

export const getCompletedPerDay = (tasks) => {
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

export const getDueDatePerDay = (tasks) => {
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

export const getEstimationHoursBreakdown = (tasks) => {
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