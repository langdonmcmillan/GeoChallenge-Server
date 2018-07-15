import * as bcrypt from "bcrypt";
import * as uuid from "uuid/v1";

import * as dal from "../../Core/db/user/userDAL";
import { generateToken } from "./authenticationService";
import ResponseObject from "../../Core/models/utility/responseObject";
import User from "../../Core/models/user/user";

export const addUser = async (
    name: string,
    email: string,
    password: string,
    isGuest: boolean = false
): Promise<ResponseObject> => {
    let response: ResponseObject = { status: 200 };
    try {
        response = isGuest
            ? await _addGuest()
            : await _addUser(name, email, password);
    } catch (error) {
        response = {
            status: 500,
            message:
                "An error occurred while registering your profile. Please try again later."
        };
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

const _addUser = async (
    name: string,
    email: string,
    password: string
): Promise<ResponseObject> => {
    const response: ResponseObject = { status: 200 };

    if (!name || !email || !password) {
        response.status = 400;
        response.message = "Username, Email and Password are required.";
    } else {
        const existingUsers = await dal.getUsers(name, email);
        if (existingUsers && existingUsers.length > 0) {
            response.status = 400;
            response.message = _getExistingUserMessage(name, existingUsers[0]);
        } else {
            password = await bcrypt.hash(password, 12);
            const user = await dal.addUser({
                name,
                email,
                password,
                isGuest: false
            });
            const token = generateToken(user.id);
            response.data = { user, token };
        }
    }
    return response;
};

const _addGuest = async (): Promise<ResponseObject> => {
    const guestUser = await dal.addUser({
        name: `Guest_${uuid()}`,
        email: "test",
        password: await bcrypt.hash(uuid(), 12),
        isGuest: true
    });
    const token = generateToken(guestUser.id, true);
    return { status: 200, data: { token, user: guestUser } };
};

const _getExistingUserMessage = (name: string, existingUser: User): string => {
    const nameExists = existingUser.name.toLowerCase() === name.toLowerCase();
    const messageItem = nameExists ? "Username" : "Email";
    return `${messageItem} already in use.`;
};
