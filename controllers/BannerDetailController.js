import { Sequelize } from "sequelize"
import db from "../models"
import { Op } from 'sequelize';

export async function getBannerDetails(req, res) {
    const bannerDetails = await db.BannerDetail.findAll();
    res.status(200).json({
        message: 'Lấy danh sách chi tiết banner thành công',
        data: bannerDetails
    });
}
export async function getBannerDetailById(req, res) {
    const { id } = req.params;
    const bannerDetail = await db.BannerDetail.findByPk(id);
    if (bannerDetail) {
        return res.status(200).json({
            message: 'Lấy thông tin chi tiết banner thành công',
            data: bannerDetail
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết banner không tìm thấy'
        });
    }
}

export async function insertBannerDetail(req, res) {
    const { product_id, banner_id } = req.body;
    const productExists = await db.Product.findByPk(product_id);
    if (!productExists) {
        return res.status(400).json({
            message: 'Sản phẩm không tồn tại'
        });
    }
    const bannerExists = await db.Banner.findByPk(banner_id);
    if (!bannerExists) {
        return res.status(400).json({
            message: 'Banner không tồn tại'
        });
    }
    const duplicateExists = await db.BannerDetail.findOne({
        where: { banner_id, product_id }
    });
    if (duplicateExists) {
        return res.status(409).json({
            message: 'Chi tiết banner với sản phẩm này đã tồn tại'
        });
    }
    const newBannerDetail = await db.BannerDetail.create({ product_id, banner_id });
    res.status(201).json({
        message: 'Thêm mới chi tiết banner thành công',
        data: newBannerDetail
    });

}

export async function deleteBannerDetail(req, res) {
    const { id } = req.params;
    const deleted = await db.BannerDetail.destroy({
        where: { id }
    });
    if (deleted) {
        return res.status(200).json({
            message: 'Xóa chi tiết banner thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết banner không tìm thấy'
        });
    }
}
export async function updateBannerDetail(req, res) {
    const { id } = req.params;
    const { product_id, banner_id } = req.body;

    const productExists = await db.Product.findByPk(product_id);
    if (!productExists) {
        return res.status(400).json({
            message: 'Sản phẩm không tồn tại'
        });
    }
    const bannerExists = await db.Banner.findByPk(banner_id);
    if (!bannerExists) {
        return res.status(400).json({
            message: 'Banner không tồn tại'
        });
    }
    const existingBannerDetail = await db.BannerDetail.findOne({
        where: {
            product_id,
            banner_id,
            id: { [Op.ne]: id } // Exclude the current record being updated
        }
    });
    if (existingBannerDetail) {
        return res.status(409).json({
            message: 'Chi tiết banner với sản phẩm này đã tồn tại'
        });
    }
    const updated = await db.BannerDetail.update({ product_id, banner_id }, {
        where: { id }
    });
    return res.status(200).json({
        message: 'Cập nhật chi tiết banner thành công'
    });

}