import { Sequelize } from "sequelize"
import { Op } from 'sequelize';
import db from "../models"
import product from "../models/product";


export const getCartItems = async (req, res) => {
    const{cart_id, page =1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    let whereClause = {};
    if (cart_id) {
        whereClause.cart_id = cart_id;
    }
    const [cartItems, totalCartItems] = await Promise.all([
        db.CartItem.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
        }),
        db.CartItem.count({
            where: whereClause
        })
    ])
    return res.status(200).json({
        message: 'Lấy danh sách mục giỏ hàng thành công',
        data: cartItems,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalCartItems / pageSize),
        totalCartItems
    })
}

export const getCartItemById = async (req, res) => {
    const {id} = req.params;
    const cartItem = await db.CartItem.findByPk(id);
    if(!cartItem) {
        return res.status(404).json({
        message: 'Mục giỏ hàng không tìm thấy'
        })
    }
    res.status(200).json({
        message: 'Lấy thông tin mục giỏ hàng thành công',
        data: cartItem
    })
}

export const getCartItemsByCartId = async (req, res) => {
    const {cart_id} = req.params;
    const cartItems = await db.CartItem.findAll({
        where: { cart_id }
    });
    res.status(200).json({
        message: 'Lấy danh sách mục giỏ hàng thành công',
        data: cartItems
    })
}  
export const insertCartItem = async (req, res) => {
    const {cart_id, product_id, quantity} = req.body;
    const productExist = await db.Product.findByPk(product_id);
    if (!productExist){
        return res.status(404).json({
            message: 'Sản phẩm không tồn tại'
        })
    }
    if (productExist.quantity < quantity) {
        return res.status(400).json({
            message: 'Sản phẩm không đủ số lượng yêu cầu'
        })
    }
    const cartExtist = await db.Cart.findByPk(cart_id);
    if(!cartExtist){
        return res.status(200).json({
            message: 'Giỏ hàng không tồn tại'
        })
    }
    const existingCartItem = await db.CartItem.findOne({
        where : {
            cart_id: cart_id,
            product_id: product_id
        }
    })
    if(existingCartItem){
        if (quantity === 0) {
            await existingCartItem.destroy();
            return res.status(200).json({
                message: 'Mục trong giỏ hàng đã được xóa'
            })
        } else {
            existingCartItem.quantity = quantity;
            await existingCartItem.save();
            return res.status(200).json({
                message: 'Cập nhật mục trong giỏ hàng thành công',
                data: existingCartItem
            })
        }
    } else {
        if(quantity > 0) {
            const newCartItem = await db.CartItem.create(req.body);
            return res.status(201).json({
                message: 'Thêm mới mục trong giỏ hàng thành công',
                data: newCartItem
            })
        }
    }
    res.status(200).json({
            message: 'Thêm mới mục trong giỏ hàng thành công',
            data: cartItem
        })
}

export const deleteCartItem = async (req, res) => {
    const {id} = req.params;
    const deleted = await db.CartItem.destroy({
        where: {id}
    });  
    if(deleted) {
        return res.status(200).json({
            message: 'Xóa mục giỏ hàng thành công'
        })
    } else {
        return res.status(404).json({
            message: 'Mục giỏ hàng không tìm thấy'
        })
    }
    
}

export const updateCartItem = async (req, res) => {
    const {id} = req.params;

    const updateCartItem = await db.CartItem.update(req.body, {
        where: {id}
    });
    if(updateCartItem[0] === 1) {
        const updatedCartItem = await db.CartItem.findByPk(id);
        return res.status(200).json({
            message: 'Cập nhật mục giỏ hàng thành công',
            data: updatedCartItem
        })
    }
    else {
        return res.status(404).json({
            message: 'Mục giỏ hàng không tìm thấy'
        })
    }   
}
