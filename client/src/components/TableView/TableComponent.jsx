import React from 'react'

const TableComponent = ({ columns, filteredTasks, setSelectedTask, setOpenDrawer }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.filter(col => col.visible).map((col) =>
                        <th key={col.key}>{col.label}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {filteredTasks.map((task, index) => (
                    <tr key={task.id} onClick={() => { setSelectedTask(task); setOpenDrawer(true); }}>
                        {columns.filter(col => col.visible).map((col) => <td key={col.key}>{col.key === 'rowNo' ? index + 1 : task[col.key]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableComponent