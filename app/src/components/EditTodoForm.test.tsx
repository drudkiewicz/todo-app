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
  http.put("/api/todos/:id", async ({ request, params, cookies }) => {
    if (params.id === "123") {
      return HttpResponse.json({
        id: "123",
        title: "Updated todo title",
        completed: false,
      });
    }
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Edit todo", () => {
  it("should edit a todo", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const todoItemEl = screen.getByTestId(`todo-123`);
    const editButton = within(todoItemEl).getByRole("button", {
      name: /Edit/i,
    });

    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    const input = within(todoItemEl).getByPlaceholderText(/Todo title/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("lorem");

    fireEvent.change(input, { target: { value: "Updated todo title" } });
    fireEvent.click(
      within(todoItemEl).getByRole("button", { name: /Update todo title/i })
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByPlaceholderText(/Todo title/i)
    );

    expect(
      within(todoItemEl).getByText("Updated todo title")
    ).toBeInTheDocument();

    expect(within(todoItemEl).queryByText("lorem")).not.toBeInTheDocument();
  });

  it("should not allow update to empty title", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const todoItemEl = screen.getByTestId(`todo-456`);
    const editButton = within(todoItemEl).getByRole("button", {
      name: /Edit/i,
    });

    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    const input = within(todoItemEl).getByPlaceholderText(/Todo title/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("ipsum");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(
      within(todoItemEl).getByRole("button", { name: /Update todo title/i })
    );

    expect(input).toHaveClass("is-invalid");
  });

  it("should cancel title update", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const todoItemEl = screen.getByTestId(`todo-456`);
    const editButton = within(todoItemEl).getByRole("button", {
      name: /Edit/i,
    });

    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    const input = within(todoItemEl).getByPlaceholderText(/Todo title/i);
    fireEvent.change(input, { target: { value: "Updated ipsum title" } });
    fireEvent.click(
      within(todoItemEl).getByRole("button", { name: /Cancel/i })
    );

    expect(input).not.toBeInTheDocument();

    expect(within(todoItemEl).getByText("ipsum")).toBeInTheDocument();

    expect(
      within(todoItemEl).queryByText("Updated ipsum title")
    ).not.toBeInTheDocument();
  });
});
