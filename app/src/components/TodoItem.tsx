import React, { useState } from "react";
import { useAppDispatch } from "../state/hooks";
import { Todo, updateTodo } from "../state/todos.reducer";
import EditTodoItemForm from "./EditTodoForm";
import DeleteTodo from "./DeleteTodo";

function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useAppDispatch();

  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [isEditing, setIsEditing] = useState(false);

  const toggleCompletedTodo = async () => {
    if (addRequestStatus === "idle") {
      try {
        setAddRequestStatus("pending");

        await dispatch(
          updateTodo({
            id: todo.id,
            completed: !todo.completed,
            title: todo.title,
          })
        ).unwrap();
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to save the todo: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <div
      className="todo-item d-flex justify-content-between mb-2 bg-light rounded-1 p-2 bg-secondary border"
      style={{
        minHeight: "50px",
      }}
    >
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleCompletedTodo()}
          aria-label="Todo completed"
        />
      </div>
      {isEditing ? (
        <EditTodoItemForm todo={todo} setIsEditing={setIsEditing} />
      ) : (
        <p
          className={`mb-0 flex-fill ${
            todo.completed && "text-black-50 text-decoration-line-through"
          }`}
        >
          {todo.title}
        </p>
      )}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`btn btn-outline-${
          isEditing ? "secondary" : "primary"
        } btn-sm p-1 d-flex justify-content-center align-items-center mx-2`}
        type="button"
        style={{
          height: "26px",
          width: "26px",
        }}
        aria-label={isEditing ? "Cancel" : "Edit"}
      >
        <i className={`bi bi-${isEditing ? "x" : "pencil"}`}></i>
      </button>
      <DeleteTodo id={todo.id} />
    </div>
  );
}
export default TodoItem;
//
