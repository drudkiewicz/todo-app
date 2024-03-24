import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import App from "../App";

export const handlers = [
  http.get("/api/todos", async ({ request, params, cookies }) => {
    return HttpResponse.json([
      {
        id: "123",
        title: "lorem",
        completed: false,
      },
      {
        id: "456",
        title: "ipsum",
        completed: true,
      },
    ]);
  }),
  http.delete("/api/todos/:id", async ({ request, params, cookies }) => {
    return HttpResponse.json({
      id: "123",
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Delete todo", () => {
  it("should delete a todo", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const todoItemEl = screen.getByTestId(`todo-123`);
    const deleteButton = within(todoItemEl).getByRole("button", {
      name: /Delete todo/i,
    });

    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitForElementToBeRemoved(() => screen.queryByText("lorem"));
  });
});
