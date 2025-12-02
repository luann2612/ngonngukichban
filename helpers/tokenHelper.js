import jwt, { decode } from 'jsonwebtoken';
import db from '../models';
const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Không có token được cung cấp');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    if(!user) {
        throw new Error('Không tim thay nguoi dung');
    }
    if(user.password_change_at &&  decoded.iat < new Date(user.password_change_at).getTime() / 1000) {
        throw new Error('Mat khau da thay doi');
    }
    return user;
}
export {getUserFromToken };