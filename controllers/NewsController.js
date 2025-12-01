import { Sequelize, where } from "sequelize"
import { Op } from 'sequelize';
import db from "../models"
import InsertNewsRequest from "../dtos/requests/news/InsertNewsRequest.js"

export async function getNews(req, res) {
    // Lấy tham số search và paging từ query
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            // Đổi 'name' thành 'title' cho phù hợp với tin tức
            title: { [Op.like]: `%${search}%` }
        };
    }

    // Dùng Promise.all để lấy dữ liệu và đếm tổng số lượng song song
    const [newsList, totalNews] = await Promise.all([
        db.News.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
            // Có thể thêm order nếu muốn sắp xếp mới nhất: order: [['created_at', 'DESC']]
        }),
        db.News.count({
            where: whereClause
        })
    ]);

    // Trả về response
    return res.status(200).json({
        message: 'Lấy danh sách tin tức thành công',
        data: newsList,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalNews / pageSize),
        totalNews // Tổng số lượng tin
    });
}

export async function getNewsById(req, res) {
    const { id } = req.params;
    const news = await db.News.findByPk(id);
    
    if (!news) {
        return res.status(404).json({
            message: 'Tin tức không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin tin tức thành công',
        data: news
    });
}

export async function insertNews(req, res) {
    const transaction = await db.sequelize.transaction();
    try {

        const news = await db.News.create(req.body, { transaction });
        const productIds = req.body.product_ids; 
        if (productIds && productIds.length ) {
            const validProducts = await db.Product.findAll({
                where: {
                    id: productIds
                },
                transaction
            });

            // Lấy ra mảng các ID thực sự tồn tại trong DB
            const validProductIds = validProducts.map(product => product.id);

            const filteredProductIds = productIds.filter(id => validProductIds.includes(id));

            const newsDetailPromises = filteredProductIds.map(product_id =>
                db.NewsDetail.create({
                    product_id: product_id,
                    news_id: news.id
                }, { transaction })
            );
            
            await Promise.all(newsDetailPromises);
        }

        // Nếu mọi thứ thành công, commit transaction
        await transaction.commit();

        return res.status(201).json({
            message: 'Thêm mới tin tức thành công',
            data: news
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Lỗi khi thêm mới tin tức',
            error: error.message
        });
    }
}
export async function deleteNews(req, res) {
    const { id } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
        await db.NewsDetail.destroy({
            where: { news_id: id },
            transaction
        });
          const deleted = await db.News.destroy({
            where: { id },
            transaction
        });
        if (deleted) {
            await transaction.commit();
            return res.status(200).json({
                message: 'Xóa tin tức thành công'
            });
        } else {
            await transaction.rollback();
            return res.status(404).json({
                message: 'Tin tức không tìm thấy'
            });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Lỗi khi xóa tin tức',
            error: error.message
        });
    }


}

export async function updateNews(req, res) {
    const { id } = req.params;
    const {name} = req.body;
    const existingNews = await db.News.findOne(
        {
             where: { name: name.trim(), id: { [Op.ne]: id } }
        });
    if (existingNews) {
        return res.status(400).json({
            message: 'Tin tức với tên này đã tồn tại'
        });
    }
    const updatedNews = await db.News.update(req.body, {
        where: { id },
    });

    // Sequelize update trả về mảng [số lượng bản ghi được update]
    if (updatedNews[0] > 0) {
        return res.status(200).json({
            message: "Cập nhật tin tức thành công",
        });
    } else {
        return res.status(404).json({
            message: "Tin tức không tìm thấy", // Hoặc không có thay đổi nào
        });
    }
}