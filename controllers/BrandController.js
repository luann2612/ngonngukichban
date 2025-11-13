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
    const {id} = req.params
    const brand = await db.Brand.findByPk(id)
    
    if(!brand) {
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
    try {
        console.log(JSON.stringify(req.body));
        
        // Sử dụng model 'Brand'
        const brand = await db.Brand.create(req.body);
        
        res.status(201).json({
            message: 'Thêm mới thương hiệu thành công',
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi thêm thương hiệu mới",
            error: error.message
        });
    }
}

export async function updateBrand(req, res) {
    res.status(200).json({
        message: 'Update thương hiệu thành công'
    });
}

export async function deleteBrand(req, res) {
    res.status(200).json({
        message: 'Xóa thương hiệu thành công'
    });
}