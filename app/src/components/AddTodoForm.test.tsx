import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
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
  http.post("/api/todos", async ({ request, params, cookies }) => {
    return HttpResponse.json({
      id: "789",
      title: "New todo title",
      completed: false,
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Add new todo", () => {
  it("should add a new todo", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const input = screen.getByPlaceholderText(/Add new todo/i);
    const button = screen.getByRole("button", { name: /Add/i });

    expect(button).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "New todo title" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    expect(await screen.findByText(/New todo title/i)).toBeInTheDocument();
  });
});
