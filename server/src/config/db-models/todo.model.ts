import { Sequelize, DataTypes } from "sequelize";

const ToDo = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

export default (sequelize: Sequelize) => {
  sequelize.define("todo", ToDo);
};
