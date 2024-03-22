import { Router, Request, Response } from "express";
import { body, matchedData, param, validationResult } from "express-validator";
import sequelize from "../config/db.config";

const router = Router({ mergeParams: true });

router.route("/").get(getAll).post(body("title").notEmpty().escape(), create);
router
  .route("/:id")
  .get([param("id").isUUID()], getById)
  .put(
    [
      param("id").isUUID(),
      body("id").isUUID(),
      body("title").notEmpty().escape(),
      body("completed").isBoolean().notEmpty(),
    ],
    update
  )
  .delete([param("id").isUUID()], remove);

const { models } = sequelize;

export async function getAll(req: Request, res: Response) {
  const todos = await models.todo.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json(todos);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id;
  const todo = await models.todo.findByPk(id);

  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).send("404 - Not found");
  }
}

export async function create(req: Request, res: Response) {
  if (req.body.id) {
    return res
      .status(400)
      .send(
        `Bad request: ID should not be provided, since it is determined automatically by the database.`
      );
  }

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  const todo = await models.todo.create(req.body);

  res.status(201).json(todo.toJSON());
}

export async function update(req: Request, res: Response) {
  const id = req.params.id;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  const data = matchedData(req);

  if (data.id === id) {
    const [, [todo]] = await models.todo.update(data, {
      where: {
        id: id,
      },
      returning: true,
    });

    res.status(200).json(todo.toJSON());
  } else {
    res
      .status(400)
      .send(
        `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
      );
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id;
  await models.todo.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).json({ id });
}

export default router;
