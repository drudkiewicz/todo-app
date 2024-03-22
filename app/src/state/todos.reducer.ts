import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// Define a type for the slice state
export interface TodosState {
  value: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: TodosState = {
  value: [],
  status: "idle",
  error: null,
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const todoIndex = state.value.findIndex(
          (el) => el.id === action.payload.id
        );
        if (todoIndex > -1) {
          state.value[todoIndex] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.value = state.value.filter((el) => el.id !== action.payload.id);
      });
  },
});

export const selectTodos = (state: RootState) => state.todos.value;
export const selectStatus = (state: RootState) => state.todos.status;

export default todosSlice.reducer;

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await axios.get("/api/todos");
  return res.data;
});

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async (newTodo: Pick<Todo, "title">) => {
    const response = await axios.post("/api/todos", newTodo);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: Todo) => {
    const response = await axios.put(
      `/api/todos/${updatedTodo.id}`,
      updatedTodo
    );
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (removedTodo: Pick<Todo, "id">) => {
    const response = await axios.delete(`/api/todos/${removedTodo.id}`);
    return response.data;
  }
);
