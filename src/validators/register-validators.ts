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

// DOCKERHUB_PASSWORD = dckr_pat_qphkl1nY2rkOGLHWby3TbPh1oNE

// DOCKERHUB_USERNAME = ankitbharvad

// JWKS_URI = http://localhost:5501/.well-known/jwks.json

// PRIVATE_KEY

// REFRESH_TOKEN_SECRET = SECRETKEYGOESHERE

// SONAR_TOKEN = 12acdfbb9c6acf93bf918686f8fbc04279fbee21

// DB_HOST = aws-0-ap-southeast-1.pooler.supabase.com

// DB_NAME = postgres

// DB_PASSWORD = Ankit2@@5..

// DB_PORT = 5432

// DB_USERNAME = postgres.dtjmnkdfdduyvsiebbba
