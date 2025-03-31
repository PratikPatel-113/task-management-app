import { create } from 'zustand';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useDataStore = create((set, get) => ({
    tasks: [],
    page: 1,
    hasMore: true,
    searchQuery: '',
    selectedStatus: 'All',

    fetchTasks: async () => {
        const { page, tasks } = get();
        const url = `${API_BASE_URL}/tasks?page=${page}&limit=10`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            set({
                tasks: [...tasks, ...data.tasks],
                page: page + 1,
                hasMore: data.hasMore,
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
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