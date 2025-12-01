import { Sequelize } from "sequelize"
import db from "../models"
const{Op} = Sequelize
import InsertUserRequest from "../dtos/requests/users/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser.js";
import argon2 from "argon2";
import UserRole from "../constants/UserRole.js";
import jwt from "jsonwebtoken";
require('dotenv').config();

export async function registerUser(req, res) {
    const {email, phone, password} = req.body;
    if(!email && !phone){
        return res.status(400).json({
            message: 'Email hoac so dien thoai khong duoc de trong'
        });
    }

    const condition = {};
    if(email){
        condition.email = email;
    }
    if(phone){
        condition.phone = phone;
    }
    const existingUser = await db.User.findOne({
        where: condition
    });
    if(existingUser){
        return res.status(400).json({
            message: 'Tai khoan da ton tai'
        });
    }
    const hashedPassword = password ? await argon2.hash(password) : null;
    const user = await db.User.create({
        ...req.body,
        email,
        phone,
        role: UserRole.USER,
        password: hashedPassword
        
    });
    return res.status(200).json({
        message: 'Dang ky thanh cong',
        data : new ResponseUser(user)
    })
    
}

export async function loginUser(req, res) {
    const {email, phone, password} = req.body;
    if (!email && !phone) {
        return res.status(400).json({
            message: 'Email hoac so dien thoai khong duoc de trong'
        })
    }
    const condition = {};
    if (email) {
        condition.email = email;
    }
    if (phone) {
        condition.phone = phone;
    }
    const user = await db.User.findOne({
        where: condition
    });
    if (!user) {
        return res.status(400).json({
            message: 'Tai khoan hoac mat khau khong dung'
        })
    }

    const passwordValid = password &&await argon2.verify(user.password, password);
    if (!passwordValid) {
        return res.status(400).json({
            message: 'Mat khau khong dung'
        })
    }
    
    const token = jwt.sign(
        {
            id: user.id,
            //role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        }
    );

    return res.status(200).json({
        message: 'Dang nhap thanh cong',
        data: {
            user: new ResponseUser(user),
            token
        }
    })
}
export async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedProduct = await db.Product.update(req.body, {
        where: { id }
    });
    if (updatedProduct[0] > 0) { 
        return res.status(200).json({
            message: 'Cập nhật sản phẩm thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Sản phẩm không tìm thấy'
        });
    }
}