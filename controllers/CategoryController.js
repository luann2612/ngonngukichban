import { Sequelize } from "sequelize"
import { Op } from 'sequelize';
import db from "../models"
// export async function getCategories(req, res) {
//     const categories = await db.Category.findAll()
//     res.status(200).json({
//         message: 'Lấy danh sách danh mục thành công',
//         data: categories
//     });
// }



export async function getCategories(req, res) {
    // Lấy tham số search và paging từ query
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                //{ description: { [Op.like]: `%${search}%` } } 
            ]
        };
    }

    // Dùng Promise.all để lấy dữ liệu và đếm tổng số lượng song song
    const [categories, totalCategories] = await Promise.all([
        db.Category.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
        }),
        db.Category.count({
            where: whereClause
        })
    ]);

    // Trả về response
    return res.status(200).json({
        message: 'Lấy danh sách danh mục thành công',
        data: categories,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalCategories / pageSize),
        totalCategories // Thay đổi total
    });
}
export async function getCategoryById(req, res) {
    const {id} = req.params
    const category = await db.Category.findByPk(id)
    
    if(!category) {
        return res.status(404).json({
            message: 'Danh mục không tìm thấy'
        })
    }
    res.status(200).json({
        message: 'Lấy thông tin danh mục thành công',
        data: category
    });
}

export async function insertCategory(req, res) {
        const category = await db.Category.create(req.body);
        res.status(201).json({
            message: 'Thêm mới danh mục thành công',
            data: category
        });
    
}
export async function deleteCategory(req, res) {
    res.status(200).json({
        message: 'Xóa danh mục thành công'
    });
}

export async function updateCategory(req, res) {
    res.status(200).json({
        message: 'Update danh mục thành công'
    });
}