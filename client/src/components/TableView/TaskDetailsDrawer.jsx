import React from 'react';
import { Drawer, Button } from '@mui/material';

const TaskDetailsDrawer = ({ open, onClose, task }) => {
    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <div style={{ width: 400, padding: '20px' }}>
                {/* Close Button */}
                <Button
                    variant="outlined"
                    onClick={onClose}
                    style={{ marginBottom: '20px', float: 'right' }}
                >
                    Close
                </Button>

                {task ? (
                    <>
                        <h1>Task Details</h1>
                        <div><strong>Task Name:</strong> {task.name}</div>
                        <div><strong>Task ID:</strong> {task.id}</div>
                        <div><strong>Description:</strong> {task.description}</div>
                        <div><strong>Assignee:</strong> {task.assignee}</div>
                        <div><strong>Status:</strong> {task.status}</div>
                        <div><strong>Due Date:</strong> {task.dueDate}</div>

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
                ) : (
                    <p>No task selected.</p>
                )}
            </div>
        </Drawer>
    );
};

export default TaskDetailsDrawer;
