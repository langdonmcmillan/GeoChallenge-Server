import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import Keys from "../../Core/config/keys";
import { getUsers } from "../../Core/db/user/userDAL";
import User from "../../Core/models/user/user";
import ResponseObject from "../../Core/models/utility/responseObject";

export const loginUser = async (user: User) => {
    const response: ResponseObject = { status: 200 };

    try {
        const existingUsers = await getUsers(user.name, user.email);
        if (!existingUsers || existingUsers.length == 0) {
            response.status = 401;
            response.message =
                "Could not log in. Username or Email was not found.";
        } else {
            const existingUser = existingUsers[0];
            if (!(await bcrypt.compare(user.password, existingUser.password))) {
                response.status = 401;
                response.message = "Could not log in. Password is incorrect.";
            } else {
                const token = generateToken(existingUser.id);
                response.data = {
                    user: existingUser,
                    token
                };
            }
        }
    } catch (error) {
        error;
        response.status = 500;
        response.message = "An error occurred.";
    }

    return response;
};

export const generateToken = (
    userId: number,
    isGuest: boolean = false
): string => {
    return jwt.sign({ data: userId }, Keys.secret, {
        expiresIn: isGuest ? "1 day" : "30 days"
    });
};
