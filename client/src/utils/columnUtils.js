export const defaultColumns = [
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

export const loadColumnsConfig = () => {
    const savedConfig = localStorage.getItem('tableColumns');
    return savedConfig ? JSON.parse(savedConfig) : defaultColumns;
};

export const saveColumnsConfig = (columns) => {
    localStorage.setItem('tableColumns', JSON.stringify(columns));
};