const sql = require("mssql");

import config from "../../config/keys";
import User from "../../models/user/user";
import SqlParam from "../../models/utility/sqlParam";
import { executeStoredProcedure } from "../baseDAL";

export const getUser = async (id: number): Promise<User> => {
    const params: SqlParam[] = [{ name: "id", type: sql.Int, value: id }];
    const result = await executeStoredProcedure("GetUser", params);

    return mapRowToUser(result.recordset[0]);
};

export const getUsers = async (
    name?: string,
    email?: string
): Promise<User[]> => {
    const params: SqlParam[] = [
        { name: "name", type: sql.VarChar, value: name },
        { name: "email", type: sql.VarChar, value: email }
    ];
    const result = await executeStoredProcedure("GetUsers", params);

    return result.recordset && result.recordset.length > 0
        ? result.recordset.map((row: any) => mapRowToUser(row))
        : undefined;
};

export const addUser = async (user: User): Promise<User | Error> => {
    const params: SqlParam[] = [
        { name: "name", type: sql.VarChar, value: user.name },
        { name: "email", type: sql.VarChar, value: user.email },
        { name: "password", type: sql.VarChar, value: user.password }
    ];
    const result = await executeStoredProcedure("AddUser", params);

    return mapRowToUser(result.recordset[0]);
};

export const updateUser = async (user: User): Promise<User | Error> => {
    const params: SqlParam[] = [
        { name: "id", type: sql.Int, value: user.id },
        { name: "name", type: sql.VarChar, value: user.name },
        { name: "email", type: sql.VarChar, value: user.email },
        { name: "password", type: sql.VarChar, value: user.password },
        { name: "isActive", type: sql.Bit, value: user.isActive }
    ];
    const result = await executeStoredProcedure("UpdateUser", params);

    return mapRowToUser(result.recordset[0]);
};

const mapRowToUser = (row: any): User => {
    return {
        id: row.Id,
        name: row.Name,
        email: row.Email,
        password: row.Password,
        isActive: row.IsActive,
        createdDate: row.CreatedDate,
        updatedDate: row.UpdatedDate
    };
};
