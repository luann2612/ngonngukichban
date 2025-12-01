import { parse } from 'dotenv';
import db from '../models';
import { Sequelize } from 'sequelize';
const { Op } = Sequelize;

export async function getProductImages(req, res){
    const {product_id} = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    let whereClause = {};
    if (product_id) {
        whereClause.product_id = product_id;
    }
    try {
        const [productImages, totalProductImages] = await Promise.all([
            db.ProductImage.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                //include: [{ model: db.Product, as: 'Product' }]
            }),
            db.ProductImage.count({
                where: whereClause
            })
        ]);
        return res.status(200).json({   
            message: 'Lấy danh sách ảnh sản phẩm thành công',
            data: productImages,
            currentPage: page,
            totalPages: Math.ceil(totalProductImages / pageSize),
            totalProductImages
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
}

export async function getProductImageById(req, res){
    const { id } = req.params;
    const productImage = await db.ProductImage.findByPk(id);
    if (!productImage) {
        return res.status(404).json({
            message: 'Ảnh sản phẩm không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin ảnh sản phẩm thành công',
        data: productImage
    });
}

export async function insertProductImage(req, res) {
    const {product_id, img_url} = req.body;
    const product = await db.Product.findByPk(product_id);
    if (!product) {
        return res.status(400).json({
            message: 'Sản phẩm không tồn tại'
        });
    }
    const existingImage = await db.ProductImage.findOne({
        where: {
            product_id: product_id,
            img_url: img_url
        }
    });
    if (existingImage) {
        return res.status(400).json({
            message: 'Ảnh sản phẩm đã tồn tại cho sản phẩm này'
        });
    }

    const productImage = await db.ProductImage.create(req.body);
    return res.status(201).json({
        message: 'Thêm mới ảnh sản phẩm thành công',
        data: productImage
    });
}
export async function deleteProductImage(req, res){
    const { id } = req.params;
    const deleted = await db.ProductImage.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xóa ảnh sản phẩm thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Ảnh sản phẩm không tìm thấy'
        });
    }
}