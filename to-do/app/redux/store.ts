import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    username: string;
    email: string;
    role: "Admin" | "User";
}

interface Task {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    completed: boolean;
}

interface TasksState {
    tasks: Task[];
    user: User | null;
}

const initialState: TasksState = {
    tasks: [],
    user: null,
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks(state, action: PayloadAction<Task[]>) {
            state.tasks = action.payload;
        },
        addTask(state, action: PayloadAction<Task>) {
            state.tasks.push(action.payload);
        },
        updateTask(state, action: PayloadAction<Task>) {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
});

export const { setTasks, addTask, updateTask, deleteTask, setUser } = tasksSlice.actions;

const store = configureStore({
    reducer: {
        tasks: tasksSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
