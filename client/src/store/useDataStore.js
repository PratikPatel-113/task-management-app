import { create } from 'zustand';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useDataStore = create((set, get) => ({
    tasks: [],
    searchQuery: '',
    selectedStatus: 'All',

    fetchTasks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            const data = await response.json();
            set({ tasks: data });
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    },

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