import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import TodoList from "./components/TodoList";
import AddTodoForm from "./components/AddTodoForm";

function App() {
  return (
    <div className="container my-5">
      <h1
        className="text-center text-uppercase fw-bold"
        style={{
          color: "var(--bs-gray-600)",
        }}
      >
        ToDo List
      </h1>
      <hr className="text-dark" />
      <div className="todo-list container p-4 rounded-3 bg-white">
        <TodoList />
        <AddTodoForm />
      </div>
    </div>
  );
}

export default App;
