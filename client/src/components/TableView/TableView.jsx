import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from '@mui/material';
import useDataStore from '../../store/useDataStore';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { loadColumnsConfig, saveColumnsConfig } from '../../utils/columnUtils'
import Filters from './Filters';
import TableComponent from './TableComponent';
import TaskDetailsDrawer from './TaskDetailsDrawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import './TableView.css';

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
  const { getFilteredTasks, fetchTasks, hasMore } = useDataStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [columns, setColumns] = useState(loadColumnsConfig);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempColumns, setTempColumns] = useState(columns);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const tableRef = useRef(null);
  const drawerRef = useRef(null);
  const modalRef = useRef(null);

  // Get filtered tasks from the store
  const filteredTasks = getFilteredTasks();

  useEffect(() => {
    fetchTasks(); // Load initial data
  }, []);

  useEffect(() => {
    if (openDrawer) {
      drawerRef.current?.focus();
    }
  }, [openDrawer]);

  useEffect(() => {
    if (modalOpen) {
      modalRef.current?.focus();
    }
  }, [modalOpen]);

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
    // Update visible columns when tempColumns changes
    const visible = tempColumns.filter(col => col.visible);
    setVisibleColumns(visible);
  }, [tempColumns]);


  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedTask(null);
    tableRef.current?.focus(); // Return focus to table
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

      <Filters setModalOpen={setModalOpen} />

      <InfiniteScroll
        dataLength={filteredTasks.length}
        next={fetchTasks}
        hasMore={hasMore}
        loader={<h4>Loading more tasks...</h4>}
        endMessage={<p>No more tasks to load.</p>}
      >
        <TableComponent
          columns={columns}
          filteredTasks={filteredTasks}
          setSelectedTask={setSelectedTask}
          setOpenDrawer={setOpenDrawer}
        />
      </InfiniteScroll>

      <TaskDetailsDrawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        task={selectedTask}
        ref={drawerRef}
        role="dialog"
        aria-labelledby="task-details-title" />

      {/* Modal for Column Selection with Drag & Drop */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="column-selection-title"
        aria-describedby="column-selection-description"
      >
        <div
          className="modal-content"
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{
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