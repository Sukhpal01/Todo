import { createSlice } from "@reduxjs/toolkit";

const getTasksFromLocalStorage = () => {
  const tasksString = localStorage.getItem("tasks");
  return tasksString ? JSON.parse(tasksString) : [];
};

export const taskSlice = createSlice({
  name: "tasks",

  initialState: { tasks: getTasksFromLocalStorage(), filter: "all" },

  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    deleteTask: (state, action) => {
      const idToDelete = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== idToDelete);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    toggleCheck: (state, action) => {
      const idToToggle = action.payload;
      const taskToToggle = state.tasks.find((task) => task.id === idToToggle);

      if (taskToToggle) {
        taskToToggle.checked = !taskToToggle.checked;
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },

    filterCheck: (state, action) => {
      state.filter = action.payload;
    },

    reorderTasks: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedTask] = state.tasks.splice(fromIndex, 1);
      state.tasks.splice(toIndex, 0, movedTask);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    editTaskName: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.name = action.payload.name;
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    },
  },
});

export const {
  addTask,
  deleteTask,
  toggleCheck,
  filterCheck,
  reorderTasks,
  editTaskName,
} = taskSlice.actions;

export default taskSlice.reducer;
