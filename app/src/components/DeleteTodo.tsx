import React, { useState } from "react";
import { useAppDispatch } from "../state/hooks";
import { deleteTodo as deleteTodoAction } from "../state/todos.reducer";

function DeleteTodo({ id }: { id: string }) {
  const dispatch = useAppDispatch();

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const deleteTodo = async () => {
    if (addRequestStatus === "idle") {
      try {
        setAddRequestStatus("pending");

        await dispatch(deleteTodoAction({ id })).unwrap();
      } catch (err) {
        console.error("Failed to delete the todo: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <button
      onClick={() => deleteTodo()}
      className="btn btn-outline-danger btn-sm p-1 d-flex justify-content-center align-items-center"
      type="button"
      style={{
        height: "26px",
        width: "26px",
      }}
      aria-label="Delete todo"
    >
      <i className="bi bi-trash"></i>
    </button>
  );
}

export default DeleteTodo;
