
import { Sequelize } from "sequelize"
import db from "../models"
const{Op} = Sequelize;
import { OrderStatus } from "../constants";
export async function getOrders(req, res) {
    const {search = '', page = 1, status} = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { note: { [Op.like]: `%${search}%` } },
            ]
        };
    }
    if (status){
        whereClause.status = status;
    }
    const [orders, totalOrders] = await Promise.all([
        db.Order.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        }),
        db.Order.count({
            where: whereClause
        })
    ]);
    return res.status(200).json({
        message: 'Lấy danh sách đơn hàng tiong',
        data: orders,
        current_page: parseInt(page, 10),
        total_pages: Math.ceil(totalOrders / pageSize),
        total : totalOrders
    });
   
}

export async function getOrderById(req, res) {
    const { id } = req.params;
    const order = await db.Order.findByPk(id, {
        include: [{
            model: db.OrderDetail,
            as: 'order_details'
        }]
    });
    if (!order) {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin đơn hàng thành công',
        data: order
    });
}

// export async function insertOrder(req, res) {
//     const userId = req.body.user_id;
//     const userExists = await db.User.findByPk(userId);
//     if (!userExists) {
//         return res.status(400).json({
//             message: 'Người dùng không tồn tại'
//         });
//     }


//     const newOrder = await db.Order.create(req.body);
//     if (newOrder) {
//         return res.status(201).json({
//             message: 'Thêm mới đơn hàng thành công',
//             data: newOrder
//         });
//     } else { 
//         return res.status(500).json({
//             message: 'Thêm đơn hàng thất bại'
//         });
//     }   
// }

export async function updateOrder(req, res) {
    const { id } = req.params;
    const updatedOrder = await db.Order.update(req.body, {
        where: { id }
    });

    if (updatedOrder[0] > 0) {
        return res.status(200).json({
            message: 'Update đơn hàng thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy'
        });
    }
}

// export async function deleteOrder(req, res) {
//     const { id } = req.params;
//     const deleted = await db.Order.destroy({
//         where: { id }
//     });

//     if (deleted) {
//         return res.status(200).json({
//             message: 'Xóa đơn hàng thành công'
//         });
//     } else {
//         return res.status(404).json({
//             message: 'Đơn hàng không tìm thấy'
//         });
//     }
// }
export async function deleteOrder(req, res) {
    const { id } = req.params;
    const [updated] = await db.Order.update({ status: OrderStatus.FAILED }, {
        where: { id }
    });

    if (updated) {
        return res.status(200).json({
            message:'Đơn hàng được đánh dấu là FAILED'
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy'
        });
    }
}