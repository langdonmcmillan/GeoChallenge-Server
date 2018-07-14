import * as bcrypt from "bcrypt";

import * as dal from "../../Core/db/user/userDAL";
import ResponseObject from "../../Core/models/utility/responseObject";
import User from "../../Core/models/user/user";

export const addUser = async (
    name: string,
    email: string,
    password: string
): Promise<ResponseObject> => {
    const response: ResponseObject = { status: 200 };
    try {
        if (!name || !email || !password) {
            response.status = 400;
            response.message = "Username, Email and Password are required.";
        } else {
            const existingUsers = await dal.getUsers(name, email);
            if (existingUsers && existingUsers.length > 0) {
                response.status = 400;
                response.message = _getExistingUserMessage(
                    name,
                    existingUsers[0]
                );
            } else {
                password = await bcrypt.hash(password, 12);
                response.data = await dal.addUser({
                    id: 0,
                    name,
                    email,
                    password
                });
            }
        }
    } catch (error) {
        response.status = 500;
        response.message =
            "An error occurred while registering your profile. Please try again later.";
    }

    return response;
};

export const getSingleUser = async (
    id?: number,
    name?: string,
    email?: string
) => {
    let user: User = undefined;
    try {
        if (id) {
            user = await dal.getUser(id);
        } else {
            const users = await dal.getUsers(name, email);
            if (users) user = users[0];
        }
        return user;
    } catch (error) {
        error;
        user = undefined;
    }
    return user;
};

const _getExistingUserMessage = (name: string, existingUser: User): string => {
    const nameExists = existingUser.name.toLowerCase() === name.toLowerCase();
    const messageItem = nameExists ? "Username" : "Email";
    return `${messageItem} already in use.`;
};
