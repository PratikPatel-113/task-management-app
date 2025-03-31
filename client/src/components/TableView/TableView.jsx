import React, { useEffect, useState } from 'react';
import { Drawer, Button, Modal } from '@mui/material';
import './TableView.css';
import useDataStore from '../../store/useDataStore';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const defaultColumns = [
  { key: 'rowNo', label: 'Row No.', visible: true },
  { key: 'name', label: 'Name', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'id', label: 'ID', visible: true },
  { key: 'assignee', label: 'Assignee', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'dueDate', label: 'Due date', visible: true },
  { key: 'estimationHours', label: 'Estimation hours', visible: false },
  { key: 'remarks', label: 'Remarks', visible: false }
];

const loadColumnsConfig = () => {
  const savedConfig = localStorage.getItem('tableColumns');
  return savedConfig ? JSON.parse(savedConfig) : defaultColumns;
};

const saveColumnsConfig = (columns) => {
  localStorage.setItem('tableColumns', JSON.stringify(columns));
};

// Sortable Column Item Component for the right panel
const SortableColumnItem = ({ column }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        margin: '4px 0',
        cursor: 'move'
      }}
      {...attributes}
      {...listeners}
    >
      <span style={{ fontSize: '16px' }}>≡</span>
      <span>{column.label}</span>
    </div>
  );
};

const TableView = () => {
  const tasks = useDataStore((state) => state.tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [columns, setColumns] = useState(loadColumnsConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempColumns, setTempColumns] = useState(columns);
  const [visibleColumns, setVisibleColumns] = useState([]);

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    filterTasks();
  }, [searchQuery, selectedStatus, tasks]);

  useEffect(() => {
    // Update visible columns when tempColumns changes
    const visible = tempColumns.filter(col => col.visible);
    setVisibleColumns(visible);
  }, [tempColumns]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  }

  const handleFilterStatus = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedTask(null);
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((task) => {
        return (
          task.name.toLowerCase().includes(searchQuery) ||
          task.description.toLowerCase().includes(searchQuery) ||
          task.assignee.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    setFilteredTasks(filtered);
  };

  const toggleColumnVisibility = (key) => {
    setTempColumns((prev) => {
      const updated = prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col));
      return updated;
    });
  };

  const handleSaveColumns = () => {
    setColumns(tempColumns);
    saveColumnsConfig(tempColumns);
    setModalOpen(false);
  };

  const handleCancelColumns = () => {
    setTempColumns([...columns]);
    setModalOpen(false);
  };

  const openColumnModal = () => {
    setTempColumns([...columns]);
    setModalOpen(true);
  };

  // Handle column reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setVisibleColumns((items) => {
        const oldIndex = items.findIndex(item => item.key === active.id);
        const newIndex = items.findIndex(item => item.key === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update the tempColumns to reflect the new order of visible columns
        const newTempColumns = [...tempColumns];

        // Remove visible columns
        const onlyHidden = newTempColumns.filter(col => !col.visible);

        // Add the reordered visible columns
        const updated = [...onlyHidden, ...reordered];

        // Sort the array so that visible columns appear in the reordered sequence
        updated.sort((a, b) => {
          if (a.visible && b.visible) {
            const aIndex = reordered.findIndex(col => col.key === a.key);
            const bIndex = reordered.findIndex(col => col.key === b.key);
            return aIndex - bIndex;
          }
          return a.visible ? -1 : 1;
        });

        setTempColumns(updated);
        return reordered;
      });
    }
  };

  return (
    <div className="table-container">
      <h1>Task Table View</h1>

      <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <select value={selectedStatus} onChange={handleFilterStatus}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={handleSearch}
        />

        <button variant="outlined" onClick={openColumnModal}>Edit Columns</button>
      </div>

      {/* Table component */}
      <table className="table">
        <thead>
          <tr>
            {columns.filter(col => col.visible).map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={task.id} onClick={() => handleRowClick(task)}>
              {columns.filter(col => col.visible).map((col) => (
                <td key={col.key}>{col.key === 'rowNo' ? index + 1 : task[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drawer for Task Details */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleCloseDrawer}
      >
        <div style={{ width: 400, padding: '20px' }}>
          {/* Close Button */}
          <Button
            variant="outlined"
            onClick={handleCloseDrawer}
            style={{ marginBottom: '20px', float: 'right' }}
          >
            Close
          </Button>
          {selectedTask && (
            <>
              <h1>Task Details</h1>
              <div><strong>Task Name:</strong> {selectedTask.name}</div>
              <div><strong>Task ID:</strong> {selectedTask.id}</div>
              <div><strong>Description:</strong> {selectedTask.description}</div>
              <div><strong>Assignee:</strong> {selectedTask.assignee}</div>
              <div><strong>Status:</strong> {selectedTask.status}</div>
              <div><strong>Due Date:</strong> {selectedTask.dueDate}</div>

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
          )}
        </div>
      </Drawer>

      {/* Modal for Column Selection with Drag & Drop */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="modal-content" style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '600px',
          margin: '5% auto',
          outline: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            <h3 style={{ margin: 0 }}>Edit columns</h3>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Left side - Column checkboxes */}
            <div style={{ width: '50%', paddingRight: '15px' }}>
              {tempColumns.map((column) => (
                <div key={column.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 0',
                }}>
                  <input
                    type="checkbox"
                    id={`col-${column.key}`}
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column.key)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#1976d2'
                    }}
                  />
                  <label
                    htmlFor={`col-${column.key}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Right side - Draggable column order */}
            <div style={{
              width: '50%',
              paddingLeft: '15px',
              borderLeft: '1px solid #eee'
            }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleColumns.map(col => col.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {visibleColumns.map((column) => (
                    <SortableColumnItem
                      key={column.key}
                      column={column}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            borderTop: '1px solid #eee',
            paddingTop: '20px'
          }}>
            <Button
              variant="outlined"
              onClick={handleCancelColumns}
              style={{
                padding: '6px 16px',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveColumns}
              style={{
                padding: '6px 16px',
                backgroundColor: '#1976d2',
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TableView;