import React from 'react';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import useDataStore from '../../store/useDataStore';

const Filters = ({ setModalOpen }) => {
    const { searchQuery, setSearchQuery, selectedStatus, setSelectedStatus } = useDataStore();

    return (
        <div className="filters" style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px' }}>
            {/* Status Dropdown */}
            <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                variant="outlined"
                size="small"
                style={{ minWidth: '150px' }}
            >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>

            {/* Search Input */}
            <TextField
                type="text"
                placeholder="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                style={{ flex: 1 }}
            />

            {/* Edit Columns Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
            >
                Edit Columns
            </Button>
        </div>
    );
};

export default Filters;
