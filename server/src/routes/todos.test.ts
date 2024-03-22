jest.mock("../config/db.config");
import sequelize from "../config/db.config";

import { v4 as uuid } from "uuid";

import request from "supertest";

import app from "../index";
import Model, { ModelCtor } from "sequelize/types/model";

const todos = [
  {
    id: uuid(),
    title: "lorem",
    completed: false,
  },
  {
    id: uuid(),
    title: "ipsum",
    completed: true,
  },
];

const mockFindAll = jest.fn().mockResolvedValue(todos);
const mockCreate = jest.fn();
const mockFindById = jest.fn().mockImplementation((id: string) => {
  return todos.find((el) => el.id === id);
});
const mockUpdate = jest
  .fn()
  .mockImplementation(({ id, ...rest }: { id: string }) => {
    const todo = todos.find((el) => el.id === id);
    if (!todo) {
      return [0, []];
    }

    return [1, [{ toJSON: jest.fn().mockReturnValue({ id, ...rest }) }]];
  });

const mockDelete = jest.fn();

sequelize.models.todo = {
  findAll: mockFindAll,
  create: mockCreate,
  findByPk: mockFindById,
  update: mockUpdate,
  destroy: mockDelete,
} as unknown as ModelCtor<Model<any, any>>;

describe("Todos api", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/todos", () => {
    it("should return all todos", async () => {
      const res = await request(app).get("/api/todos");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(todos);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockFindAll).toHaveBeenCalledWith({
        order: [["createdAt", "ASC"]],
      });
    });

    it("should return no todos when none are found", async () => {
      mockFindAll.mockResolvedValueOnce([]);
      const res = await request(app).get("/api/todos");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /api/todos", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new todo", async () => {
      const newTodo = {
        id: uuid(),
        title: "dolor",
        completed: false,
      };

      mockCreate.mockResolvedValueOnce({
        toJSON: jest.fn().mockReturnValue(newTodo),
      });

      const res = await request(app).post("/api/todos").send({
        title: "dolor",
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(newTodo);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({ title: "dolor" });
    });

    it("should sanitize todo title", async () => {
      const newTodo = {
        id: uuid(),
        title: "dolor&&&&",
        completed: false,
      };

      mockCreate.mockResolvedValueOnce({
        toJSON: jest.fn().mockReturnValue(newTodo),
      });

      const res = await request(app).post("/api/todos").send({
        title: newTodo.title,
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(newTodo);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({
        title: "dolor&amp;&amp;&amp;&amp;",
      });
    });

    it("should return error when id is supplied", async () => {
      const res = await request(app).post("/api/todos").send({
        id: "678",
        title: "dolor",
      });
      expect(res.status).toBe(400);
      expect(res.text).toBe(
        `Bad request: ID should not be provided, since it is determined automatically by the database.`
      );
    });

    it("should return error when title is empty", async () => {
      const res = await request(app).post("/api/todos").send({});
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        errors: [
          {
            type: "field",
            msg: "Invalid value",
            path: "title",
            location: "body",
          },
        ],
      });
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should return correct todo", async () => {
      const res = await request(app).get(`/api/todos/${todos[0].id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(todos[0]);

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenCalledWith(todos[0].id);
    });

    it("should return 404 when none are found", async () => {
      const res = await request(app).get("/api/todos/404");

      expect(res.status).toBe(404);
      expect(res.text).toEqual("Todo not found");
    });
  });

  describe("PUT /api/todos", () => {
    it("should update a todo", async () => {
      const updatedTodo = {
        id: todos[1].id,
        title: "sit",
        completed: true,
      };

      const res = await request(app)
        .put(`/api/todos/${updatedTodo.id}`)
        .send(updatedTodo);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedTodo);

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith(updatedTodo, {
        returning: true,
        where: {
          id: updatedTodo.id,
        },
      });
    });

    it("should return error when todo is not found", async () => {
      const updatedTodo = {
        id: uuid(),
        title: "sit",
        completed: true,
      };

      const res = await request(app)
        .put(`/api/todos/${updatedTodo.id}`)
        .send(updatedTodo);

      expect(res.status).toBe(404);
      expect(res.text).toBe("Todo not found");
    });

    it("should return error when title is empty", async () => {
      const updatedTodo = {
        id: todos[0].id,
        title: "",
        completed: true,
      };

      const res = await request(app)
        .put(`/api/todos/${updatedTodo.id}`)
        .send(updatedTodo);
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        errors: [
          {
            type: "field",
            msg: "Invalid value",
            path: "title",
            location: "body",
            value: "",
          },
        ],
      });
    });

    it("should return error when completed is not a boolean", async () => {
      const updatedTodo = {
        id: todos[0].id,
        title: "abc",
        completed: "abc",
      };

      const res = await request(app)
        .put(`/api/todos/${updatedTodo.id}`)
        .send(updatedTodo);
      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        errors: [
          {
            type: "field",
            msg: "Invalid value",
            path: "completed",
            location: "body",
            value: "abc",
          },
        ],
      });
    });

    it("should return error when id does not match param id", async () => {
      const updatedTodo = {
        id: todos[0].id,
        title: "abc",
        completed: true,
      };

      const res = await request(app)
        .put(`/api/todos/${todos[1].id}`)
        .send(updatedTodo);
      expect(res.status).toBe(400);
      expect(res.text).toEqual(
        `Bad request: param ID (${todos[1].id}) does not match body ID (${updatedTodo.id}).`
      );
    });

    it("should sanitize todo title", async () => {
      const updatedTodo = {
        id: todos[0].id,
        title: "<script>amet</script>",
        completed: false,
      };

      const sanitizedTitle = "&lt;script&gt;amet&lt;&#x2F;script&gt;";

      const res = await request(app)
        .put(`/api/todos/${updatedTodo.id}`)
        .send(updatedTodo);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...updatedTodo,
        title: sanitizedTitle,
      });

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          ...updatedTodo,
          title: sanitizedTitle,
        },
        {
          returning: true,
          where: {
            id: updatedTodo.id,
          },
        }
      );
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should perform deletion on given id", async () => {
      const res = await request(app).delete(`/api/todos/${todos[1].id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: todos[1].id });

      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: todos[1].id } });
    });
  });
});
