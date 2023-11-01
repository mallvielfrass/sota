require('dotenv').config();
console.log(process.env);
export const db_url = process.env.DB_URL;
export const jwtSecret = process.env.JWT_SECRET;
export const expireJwtShiftSeconds = 60 * 60 * 24 * 7;
