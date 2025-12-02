import { Sequelize, where } from "sequelize"
import { Op } from 'sequelize';
import db from "../models"
import fs from 'fs';
import path from 'path';
import { BannerStatus } from "../constants";
import { getAvatarUrl } from "../helpers/imageHelper";
export async function getBanners(req, res) {
    // Lấy tham số search và paging từ query
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            // Tìm kiếm theo trường 'name'
            name: { [Op.like]: `%${search}%` }
        };
    }

    // Dùng Promise.all để lấy dữ liệu và đếm tổng số lượng song song
    const [banners, totalBanners] = await Promise.all([
        db.Banner.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
    
        }),
        db.Banner.count({
            where: whereClause
        })
    ]);

    // Trả về response
    return res.status(200).json({
        message: 'Lấy danh sách banner thành công',
        data: banners.map(banner =>({
            ...banner.get({plain: true}),
            image: getAvatarUrl(banner.image)
        })),
        current_page: parseInt(page, 10),
        total_pages: Math.ceil(totalBanners / pageSize),
        total : totalBanners
    });
}

export async function getBannerById(req, res) {
    const { id } = req.params;
    const banner = await db.Banner.findByPk(id);

    if (!banner) {
        return res.status(404).json({
            message: 'Banner không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin banner thành công',
        data: {
            ...banner.get({plain: true}),
            image: getAvatarUrl(banner.image)
        }
    });
}

export async function insertBanner(req, res) {
    const {name} = req.body;
    const existingBanner = await db.Banner.findOne(
        {
             where: { name: name.trim() } 
        });
    if (existingBanner) {
        return res.status(400).json({
            message: 'Banner với tên này đã tồn tại'
        });
    }
    const bannerData = {
        ...req.body,
        status: BannerStatus.ACTIVE
    }

    const banner = await db.Banner.create(bannerData);

    return res.status(201).json({
        message: 'Thêm mới banner thành công',
        data: {
            ...banner.get({plain: true}),
            image: getAvatarUrl(banner.image)
        }
    });


}

export async function deleteBanner(req, res) {
    const { id } = req.params;


    const deleted = await db.Banner.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa banner thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Banner không tìm thấy'
        });
    }

}

export async function updateBanner(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    if (name !== undefined) {
        const existingBanner = await db.Banner.findOne({
            where: {
                name: req.body.name,
                id: { [Op.ne]: id }
            }
        });
        if (existingBanner) {
            return res.status(400).json({
                message: 'Banner với tên này đã tồn tại'
            });
        }
    }
    const [updatedCount] = await db.Banner.update(req.body, {
        where: { id },
    });

    if (updatedCount > 0) {
        return res.status(200).json({
            message: "Cập nhật banner thành công",
        });
    } else {
        return res.status(404).json({
            message: "Banner không tìm thấy hoặc không có thay đổi nào",
        });
    }

}