import React, { useState } from "react";
import { useAppDispatch } from "../state/hooks";
import { Todo, updateTodo as updateTodoAction } from "../state/todos.reducer";

function EditTodoItemForm({
  todo,
  setIsEditing,
}: {
  todo: Todo;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const dispatch = useAppDispatch();

  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [title, setTitle] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const updateTodo = async () => {
    const isInvalid = !title;
    if (isInvalid) {
      setIsInvalid(true);
      return;
    }

    if (addRequestStatus === "idle") {
      try {
        setAddRequestStatus("pending");

        await dispatch(
          updateTodoAction({ id: todo.id, title, completed: todo.completed })
        ).unwrap();
        setTitle("");
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to save the todo: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <>
      <input
        className={`form-control form-control-sm mb-0 flex-fill ${
          isInvalid && "is-invalid"
        }`}
        type="text"
        placeholder="Todo title..."
        aria-label="Todo title"
        defaultValue={todo.title}
        style={{
          width: "auto",
        }}
        onChange={(e) => {
          setTitle(e.target.value);
          isInvalid && !!e.target.value && setIsInvalid(false);
        }}
        onKeyDown={(e) => (e.key === "Enter" ? updateTodo() : null)}
      />
      <button
        onClick={() => updateTodo()}
        className="btn btn-outline-success btn-sm p-1 d-flex justify-content-center align-items-center ms-2"
        type="button"
        style={{
          height: "26px",
          width: "26px",
        }}
        aria-label="Update todo title"
      >
        <i className="bi bi-check"></i>
      </button>
    </>
  );
}
export default EditTodoItemForm;
// text-black-50 text-decoration-line-through
