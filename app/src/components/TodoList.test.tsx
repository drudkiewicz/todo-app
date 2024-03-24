import React from "react";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../utils/test-utils";
import App from "../App";

export const handlers = [
  http.get("/api/todos", async ({ request, params, cookies }) => {
    await delay(150);
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
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Todo List App", () => {
  describe("Todo List", () => {
    it("should show all todos", async () => {
      renderWithProviders(<App />);

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();

      expect(await screen.findByText(/lorem/i)).toBeInTheDocument();
      expect(screen.getByText(/ipsum/i)).toBeInTheDocument();
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });
});
