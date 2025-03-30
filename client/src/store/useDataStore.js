import { create } from 'zustand';

const useDataStore = create((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
}));

export default useDataStore;