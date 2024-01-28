import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is required",
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    firstName: {
        errorMessage: "FirstName is required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "LastName is required",
        notEmpty: true,
        trim: true,
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: "Password should be at least 8 chars",
        },
    },
});
