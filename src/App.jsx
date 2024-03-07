import { useEffect, useReducer, useState } from "react"

function reducer(state, action) {
  switch (action.type) {
    case "all":
      return [...action.tasks];
    case "completed":
      return action.tasks.filter(task => task.checked);
    case "incompleted":
      return action.tasks.filter(task => !task.checked);
    default:
      return state;
  }
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedData = localStorage.getItem("TodoTasks");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [filter, dispatch] = useReducer(reducer, tasks);

  const addTask = (task) => {
    setTasks([...tasks, { text: task, checked: false }]);
    dispatch({ type: "all", tasks: [...tasks, { text: task, checked: false }] });
  };

  console.log(filter)

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].checked = !newTasks[index].checked;
    setTasks(newTasks);
    dispatch({ type: "all", tasks: newTasks });
  };

  useEffect(() => {
    localStorage.setItem("TodoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (index) => {
    const taskToDelete = filter[index]; 
    const newTasks = tasks.filter((task, i) => i !== tasks.indexOf(taskToDelete));
    setTasks(newTasks);
    dispatch({ type: "all", tasks: newTasks });
  };


  return (
    <div className="flex items-center justify-center h-screen bg-blue-100 ">
      <div className="bg-white w-4/12 h-5/6 rounded-md shadow-lg">
        <Header />
        <div className="px-4">
          <AddTask addTask={addTask} />
          <TaskList tasks={filter} setTasks={setTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </div>
        <div>
          <Filters tasks={tasks} setTasks={setTasks} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );

}

//heading
function Header() {
  return (
    <h1 className="text-3xl font-semibold mb-5 text-center bg-blue-600 text-white p-2 rounded-t-md">Todo List</h1>
  )
}

//input and add button
function AddTask({ addTask }) {
  const [enterTask, setEnterTask] = useState("");

  const handleInputChange = (e) => {
    setEnterTask(e.target.value);
  };

  const handleAddTask = () => {
    if (enterTask.trim() !== "") {
      addTask(enterTask);
      setEnterTask("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="flex items-center justify-center gap-5 mb-7">
      <input
        type="text"
        className="w-56 border outline-none h-8 p-2 focus:border-blue-700"
        placeholder="Enter Task Here..."
        onChange={handleInputChange}
        value={enterTask}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-20"
        onClick={handleAddTask}
      >
        Add Task
      </button>
    </div>
  );
}

// Task List                      
function TaskList({ tasks, setTasks, toggleTask, deleteTask }) {

  return (
    <ul className="flex flex-col gap-2 overflow-auto h-72">
      {tasks.map((task, index) => (
        <li key={index} className="border-b pb-2 flex justify-between items-center">
          <div className="flex gap-3">
            <button type="button" onClick={() => toggleTask(index)}>{task.checked ? "❌" : "✔️"}</button>
            <span className={task.checked ? "line-through" : ""}>
              {task.text}
            </span>
          </div>
          <button type="button" onClick={() => { deleteTask(index) }}>
            <svg className="w-5 h-5 text-red-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
          </button>
        </li>
      ))}
    </ul>
  );
}


//filters
function Filters({ tasks, dispatch }) {

  return (
    <ul className="flex justify-between p-2">
      <li className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-sm text-white font-semibold" onClick={() => { dispatch({ type: "all", tasks }) }}><button type="button">All Tasks</button></li>
      <li className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-sm text-white font-semibold" onClick={() => { dispatch({ type: "completed", tasks }) }}><button type="button">Completed Tasks</button></li>
      <li className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-sm text-white font-semibold" onClick={() => { dispatch({ type: "incompleted", tasks }) }}><button type="button">Incompleted Tasks</button></li>
    </ul>
  )
}

export default App
