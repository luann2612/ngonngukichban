import { Sequelize } from "sequelize"
import db from "../models"
import { Op } from 'sequelize';


export async function getBrands(req, res) {
    // Lấy tham số search và paging từ query
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
            ]
        };
    }


    const [brands, totalBrands] = await Promise.all([
        db.Brand.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
        }),
        db.Brand.count({
            where: whereClause
        })
    ]);


    return res.status(200).json({
        message: 'Lấy danh sách thương hiệu thành công',
        data: brands, // Thay đổi data
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalBrands / pageSize),
        totalBrands
    })
}

// export async function getBrands(req, res) {
//     const brands = await db.Brand.findAll()
//     res.status(200).json({
//         message: 'Lấy danh sách thương hiệu thành công',
//         data: brands
//     });
// }

export async function getBrandById(req, res) {
    const { id } = req.params
    const brand = await db.Brand.findByPk(id)

    if (!brand) {
        return res.status(404).json({
            message: 'Thương hiệu không tìm thấy'
        })
    }
    res.status(200).json({
        message: 'Lấy thông tin thương hiệu thành công',
        data: brand
    });
}

export async function insertBrand(req, res) {
        const brand = await db.Brand.create(req.body);
        if (brand) {
            return res.status(201).json({
                message: 'Thêm mới thương hiệu thành công',
                data: brand
            });
        } else { 
            return res.status(500).json({
                message: 'Thêm thương hiệu thất bại'
            });
        }
}

export async function updateBrand(req, res) {
    const { id } = req.params;
    const {name} = req.body;
    if (name !== undefined) {
        const existingBrand = await db.Brand.findOne(
            {
                where: {
                    name: name.trim(),
                    id: { [Op.ne]: id }
                }
            });
        if (existingBrand) {
            return res.status(400).json({
                message: 'Thương hiệu với tên này đã tồn tại'
            });
        }
    }

    const updatedBrand = await db.Brand.update(req.body, {
        where: { id }
    });

    if (updatedBrand[0] > 0) {
        return res.status(200).json({
            message: 'Cập nhật thương hiệu thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Thương hiệu không tìm thấy'
        });
    }
}

export async function deleteBrand(req, res) {
    const { id } = req.params;
    // Giả định model là db.Brand
    const deleted = await db.Brand.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa thương hiệu thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Thương hiệu không tìm thấy'
        });
    }
}