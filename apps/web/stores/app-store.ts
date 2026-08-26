import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Resource, AppState, User } from '@/types';

interface AppStore {
  // Estado
  tasks: Task[];
  resources: Resource[];
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  toggleTask: (id: number) => void;
  
  setResources: (resources: Resource[]) => void;
  addResource: (resource: Omit<Resource, 'id'>) => void;
  deleteResource: (id: number) => void;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      tasks: [],
      resources: [],
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Tasks
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (task) => {
        const currentTasks = get().tasks;
        const newId = Math.max(0, ...currentTasks.map(t => t.id)) + 1;
        set({ tasks: [...currentTasks, { ...task, id: newId }] });
      },
      
      updateTask: (id, updates) => {
        const currentTasks = get().tasks;
        set({
          tasks: currentTasks.map(t => t.id === id ? { ...t, ...updates } : t)
        });
      },
      
      deleteTask: (id) => {
        const currentTasks = get().tasks;
        set({ tasks: currentTasks.filter(t => t.id !== id) });
      },
      
      toggleTask: (id) => {
        const currentTasks = get().tasks;
        set({
          tasks: currentTasks.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        });
      },
      
      // Resources
      setResources: (resources) => set({ resources }),
      
      addResource: (resource) => {
        const currentResources = get().resources;
        const newId = Math.max(0, ...currentResources.map(r => r.id)) + 1;
        set({ resources: [...currentResources, { ...resource, id: newId }] });
      },
      
      deleteResource: (id) => {
        const currentResources = get().resources;
        set({ resources: currentResources.filter(r => r.id !== id) });
      },
      
      // User & Auth
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      logout: () => set({ user: null, isAuthenticated: false })
    }),
    {
      name: 'marcyhub-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tasks: state.tasks,
        resources: state.resources
      })
    }
  )
);
