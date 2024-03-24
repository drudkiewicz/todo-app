import React, { useState } from "react";
import { addNewTodo } from "../state/todos.reducer";
import { useAppDispatch } from "../state/hooks";

function AddTodoForm() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const canSave = !!title && addRequestStatus === "idle";

  const addTodo = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        await dispatch(addNewTodo({ title })).unwrap();
        setTitle("");
      } catch (err) {
        console.error("Failed to save the todo: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <div className="d-flex justify-content-between bg-light rounded-1 p-2 bg-secondary border">
      <input
        className="form-control form-control-sm mb-0 flex-fill me-3"
        type="text"
        placeholder="Add new todo..."
        aria-label="New todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? addTodo() : null)}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => addTodo()}
      >
        Add
      </button>
    </div>
  );
}

export default AddTodoForm;
