import * as sql from "mssql";

import config from "../config/keys";
import SqlParam from "../models/utility/sqlParam";

const pool = new sql.ConnectionPool(config.databaseConfig);
pool.connect();
pool.on("error", (error: any) => {
    pool.close();
    throw error;
});

export const executeStoredProcedure = async (
    storedProc: string,
    params: SqlParam[]
) => {
    const request = new sql.Request(pool);
    params.forEach((param: SqlParam) => {
        request.input(param.name, param.type, param.value);
    });
    return await request.execute(storedProc);
};
