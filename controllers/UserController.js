import { Sequelize } from "sequelize"
import db from "../models"
const{Op} = Sequelize
import InsertUserRequest from "../dtos/requests/users/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser.js";
import argon2 from "argon2";
import UserRole from "../constants/UserRole.js";
import jwt from "jsonwebtoken";
require('dotenv').config();
import os from "os";
import { getAvatarUrl } from "../helpers/imageHelper.js";

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
            iat: Math.floor(Date.now() / 1000)
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
export async function updateUser(req, res) {
    const {id} = req.params;
    const { name, avatar, old_password, new_password } = req.body;
    if(req.user.id != id){
        return res.status(403).json({
            message: 'Khong co quyen cap nhat nguoi dung khac'
        });
    }

    const user = await db.User.findByPk(id);
    if(!user){
        return res.status(404).json({
            message: 'Khong tim thay nguoi dung'
        });
    }
    
    if(old_password && new_password){
        const passwordValid = await argon2.verify(user.password, old_password);
        if(!passwordValid){
            return res.status(400).json({
                message: 'Mat khau khong dung'
            });
        }

        user.password = await argon2.hash(new_password);
        user.password_change_at = new Date();
    } else if(old_password || new_password){
        return res.status(400).json({
            message: 'Cần nhap mat khau cu va mat khau moi'
        });
    }
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    await user.save();
    user.avatar = getAvatarUrl(user.avatar);
    return res.status(200).json({
        message: 'Cap nhat nguoi dung thanh cong',
        data: user
    });
}