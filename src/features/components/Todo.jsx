import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteTask,
  addTask,
  toggleCheck,
  filterCheck,
  reorderTasks,
  editTaskName,
} from "./taskSlice";

//todo
export function Todo() {
  return (
    <div className="bg-blue-100">
      <div className=" flex items-center justify-center h-screen">
        <div className="bg-white w-1/3 rounded-md">
          <div className="text-center bg-blue-600 rounded-t-md mb-3">
            <Header />
          </div>
          <AddTask />
          <Priority />
          <div className="px-2 h-72 overflow-auto">
            <TaskList />
          </div>

          <LowPriority />
          <div>
            <Filters />
          </div>
        </div>
      </div>
    </div>
  );
}

//Heading
function Header() {
  return (
    <h1 className="text-2xl font-semibold text-white p-2">
      Get Things Done!!👍🏻
    </h1>
  );
}

//Prioritize tasks
function Priority() {
  return (
    <div className="flex justify-between items-center mx-10 mt-3 text-sm border-b-2 pb-1">
      <span className="font-semibold text-red-800">Priority</span>
      <span>High⬆️</span>
    </div>
  );
}

function LowPriority() {
  return (
    <div className="flex justify-between items-center mx-10 text-sm border-t-2">
      <span className="font-semibold text-red-800">Priority</span>
      <span>Low⬇️</span>
    </div>
  );
}

//input and add button
function AddTask() {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    id: Date.now(),
    name: "",
    checked: false,
  });

  const handleAddTask = () => {
    if (task.name.trim() !== "") {
      dispatch(addTask({ id: task.id, name: task.name, checked: false }));
      setTask({ id: Date.now(), name: "", checked: false });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="flex justify-center my-1">
      <div className="border-2 border-blue-600">
        <input
          type="text"
          className="h-8 p-2 outline-none"
          placeholder="Enter Task..."
          value={task.name}
          onKeyDown={handleKeyPress}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
        <button
          type="button"
          className="h-8 bg-blue-600 px-2 text-white"
          onClick={handleAddTask}
        >
          Add task
        </button>
      </div>
    </div>
  );
}

// TaskList component
function TaskList() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const dispatch = useDispatch();

  const [editTask, setEditTask] = useState({ id: null, name: "" });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.checked;
    } else if (filter === "incompleted") {
      return !task.checked;
    }
    return true;
  });

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    dispatch(reorderTasks({ fromIndex, toIndex: index }));
  };

  const handleEditClick = (taskId, taskName) => {
    setEditTask({ id: taskId, name: taskName });
  };

  const handleEditChange = (e) => {
    setEditTask({ ...editTask, name: e.target.value });
  };

  const handleEditSubmit = () => {
    dispatch(editTaskName({ id: editTask.id, name: editTask.name }));
    setEditTask({ id: null, name: "" });
  };

  return (
    <ul className="mx-8" onDragOver={handleDragOver}>
      {filteredTasks.map((task, index) => (
        <li
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className="flex justify-between border-b pt-2 pb-2"
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleCheck(task.id))}
            >
              {task.checked ? "❌" : "✔️"}
            </button>

            {editTask.id === task.id ? (
              <>
                <input
                  type="text"
                  className="outline outline-1 focus:border-none focus:outline-1"
                  value={editTask.name}
                  onChange={handleEditChange}
                />
                <button type="button" onClick={handleEditSubmit}>
                  Save
                </button>
              </>
            ) : (
              <span className={task.checked ? "line-through" : ""}>
                {task.name}
              </span>
            )}
          </div>

          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => handleEditClick(task.id, task.name)}
            >
              ✏️
            </button>
            <button type="button" onClick={() => dispatch(deleteTask(task.id))}>
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

//filters
function Filters() {
  const dispatch = useDispatch();

  const handleFilterChange = (filter) => {
    dispatch(filterCheck(filter));
  };

  return (
    <ul className="flex justify-around mt-4  px-2">
      <li>
        <button
          type="button"
          onClick={() => dispatch(handleFilterChange("all"))}
          className="bg-blue-600 text-sm text-white w-28 h-8 hover:bg-blue-700 rounded-full"
        >
          All Tasks
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => dispatch(handleFilterChange("completed"))}
          className="bg-blue-600 text-sm text-white w-32 h-8 hover:bg-blue-700 rounded-full"
        >
          Completed Tasks
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => dispatch(handleFilterChange("incompleted"))}
          className="bg-blue-600 text-sm text-white w-32 h-8 hover:bg-blue-700 rounded-full"
        >
          Incompleted Tasks
        </button>
      </li>
    </ul>
  );
}
