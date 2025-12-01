import db from "../models"
import { Sequelize } from "sequelize"
import { Op } from 'sequelize';


export const getNewsDetails = async (req, res) => {
    // Lấy tham số search và paging từ query
    const { page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    // let whereClause = {};
    // if (search.trim() !== '') {
    //     whereClause = {
    //         [Op.or]: [
    //             // Thay thế 'name' bằng các trường có trong NewsDetail
    //             // MySQL cho phép dùng LIKE với số, nên cấu trúc này vẫn giữ nguyên được
    //             { news_id: { [Op.like]: `%${search}%` } },
    //             { product_id: { [Op.like]: `%${search}%` } } 
    //         ]
    //     };
    // }

    // Dùng Promise.all để lấy dữ liệu và đếm tổng số lượng song song
    const [newsDetails, totalNewsDetails] = await Promise.all([
        db.NewsDetail.findAll({
            limit: pageSize,
            offset: offset,
            include: [{model: db.News}, {model: db.Product }]
            }),
        db.NewsDetail.count()
    ]);

    // Trả về response
    return res.status(200).json({
        message: 'Lấy danh sách chi tiết tin tức thành công',
        data: newsDetails,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalNewsDetails / pageSize),
        totalNewsDetails // Tổng số lượng
    });
}

export async function getNewsDetailById(req, res) {
    const { id } = req.params;
    const newsDetail = await db.NewsDetail.findByPk(id, {
        include: [
            {model: db.News}, {model: db.Product }
        ]
    });
    
    if (!newsDetail) {
        return res.status(404).json({
            message: 'Chi tiết tin tức không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin chi tiết tin tức thành công',
        data: newsDetail
    });
}

export async function insertNewsDetail(req, res) {
    const {product_id, news_id} = req.body;
    const productExists = await db.Product.findByPk(product_id);
    if (!productExists) {
        return res.status(400).json({
            message: 'Sản phẩm không tồn tại'
        });
    }
    const newsExists = await db.News.findByPk(news_id);
    if (!newsExists) {
        return res.status(400).json({
            message: 'Tin tức không tồn tại'
        });
    }

    const duplicateExists = await db.NewsDetail.findOne({
        where: { news_id, product_id}
    });
    if (duplicateExists) {
        return res.status(409).json({
            message: 'Chi tiết tin tức với sản phẩm này đã tồn tại'
        });
    }
    const newNewsDetail = await db.NewsDetail.create({product_id, news_id});
    res.status(201).json({
        message: 'Thêm mới chi tiết tin tức thành công',
        data: newNewsDetail
    });

}

export async function deleteNewsDetail(req, res) {
    const { id } = req.params;

    const deleted = await db.NewsDetail.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa chi tiết tin tức thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Chi tiết tin tức không tìm thấy'
        });
    }
}

export async function updateNewsDetail(req, res) {
    const { id } = req.params;
    const {product_id, news_id} =  req.body;

    const existingDuplicate = await db.NewsDetail.findOne({
        where: {
            product_id,
            news_id,
            id: { [Sequelize.Op.ne]: id } // Exclude current record
        }
    });
    if (existingDuplicate) {
        return res.status(409).json({
            message: 'Chi tiết tin tức với sản phẩm này đã tồn tại'
        });
    }
    const updatedNewsDetail = await db.NewsDetail.update({product_id, news_id}, {
        where: { id },
    });

    if (updatedNewsDetail[0] > 0) {
        return res.status(200).json({
            message: "Cập nhật chi tiết tin tức thành công",
        });
    } else {
        return res.status(404).json({
            message: "Chi tiết tin tức không tìm thấy", 
        });
    }
}