import { useEffect } from "react";
import { fetchTodos, selectTodos } from "../state/todos.reducer";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import TodoItem from "./TodoItem";

function TodoList() {
  const dispatch = useAppDispatch();

  const todos = useAppSelector(selectTodos);
  const todosStatus = useAppSelector((state) => state.todos.status);

  useEffect(() => {
    if (todosStatus === "idle") {
      dispatch(fetchTodos());
    }
  }, [dispatch, todosStatus]);

  return (
    <>
      {todosStatus === "loading" ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        todos.map((task) => <TodoItem key={task.id} todo={task} />)
      )}
    </>
  );
}
export default TodoList;
