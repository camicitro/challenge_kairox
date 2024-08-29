"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT)
});
exports.sequelize = sequelize;
