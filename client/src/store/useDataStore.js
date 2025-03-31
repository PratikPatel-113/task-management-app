import { create } from 'zustand';

const useDataStore = create((set, get) => ({
    tasks: [],
    searchQuery: '',
    selectedStatus: 'All',

    setTasks: (tasks) => set({ tasks }),
    setSearchQuery: (query) => set({ searchQuery: query.toLowerCase() }),
    setSelectedStatus: (status) => set({ selectedStatus: status }),

    getFilteredTasks: () => {
        const { tasks, searchQuery, selectedStatus } = get();

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

        return filtered;
    }
}));

export default useDataStore;