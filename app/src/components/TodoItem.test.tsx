import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  fireEvent,
  screen,
  waitFor,
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
        title: "lorem",
        completed: true,
      });
    } else if (params.id === "456") {
      return HttpResponse.json({
        id: "456",
        title: "ipsum",
        completed: false,
      });
    }
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Todo Item", () => {
  it("should show if todo is done", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/));

    const loremEl = screen.getByTestId(`todo-123`);
    expect(within(loremEl).getByText(/lorem/i)).toBeInTheDocument();
    expect(within(loremEl).getByRole("checkbox")).not.toBeChecked();

    const ipsumEl = screen.getByTestId(`todo-456`);
    expect(within(ipsumEl).getByText(/ipsum/i)).toBeInTheDocument();
    expect(within(ipsumEl).getByRole("checkbox")).toBeChecked();
  });

  it("should toggle todo completed status", async () => {
    renderWithProviders(<App />);

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    const loremEl = screen.getByTestId(`todo-123`);
    const loremCheckbox = within(loremEl).getByRole("checkbox");

    expect(loremCheckbox).not.toBeChecked();

    fireEvent.click(loremCheckbox);

    await waitFor(() => {
      expect(loremCheckbox).toBeChecked();
    });

    const ipsumEl = screen.getByTestId(`todo-456`);
    const ipsumCheckbox = within(ipsumEl).getByRole("checkbox");

    expect(ipsumCheckbox).toBeChecked();

    fireEvent.click(ipsumCheckbox);

    await waitFor(() => {
      expect(ipsumCheckbox).not.toBeChecked();
    });
  });
});
