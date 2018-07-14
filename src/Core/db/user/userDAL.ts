const sql = require("mssql");

import config from "../../config/keys";
import User from "../../models/user/user";

export const getUser = async (id?: number): Promise<User> => {
    const pool = await sql.connect(config.databaseConfig);

    const result = await pool
        .request()
        .input("@id", sql.VarChar, id)
        .execute("GetUser");

    console.log(result);
    return result;
};

export const getUsers = async (
    name?: string,
    email?: string
): Promise<User[]> => {
    const pool = await sql.connect(config.databaseConfig);

    const result = await pool
        .request()
        .input("@name", sql.VarChar, name)
        .input("@email", sql.VarChar, email)
        .execute("GetUsers");

    console.log(result);
    return result;
};

export const addUser = async (user: User): Promise<User | Error> => {
    const pool = await sql.connect(config.databaseConfig);

    const result = await pool
        .request()
        .input("@name", sql.VarChar, user.name)
        .input("@email", sql.VarChar, user.email)
        .input("@password", sql.VarChar, user.password)
        .execute("AddUser");

    console.log(result);
    return result;
};

export const updateUser = async (user: User): Promise<User | Error> => {
    const pool = await sql.connect(config.databaseConfig);

    const result = await pool
        .request()
        .input("@name", sql.VarChar, user.name)
        .input("@email", sql.VarChar, user.email)
        .input("@password", sql.VarChar, user.password)
        .input("@password", sql.VarChar, user.isActive)
        .execute("AddUser");

    console.log(result);
    return result;
};
