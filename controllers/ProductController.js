import { Sequelize } from "sequelize"
import db from "../models"
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest"
import UpdateProductRequest from "../dtos/requests/product/UpdateProductRequest"
const{Op} = Sequelize
export async function getProducts(req, res) {
    // const products = await db.Product.findAll()
    //search and paging
    const {search = '', page = 1} = req.query
    const pageSize = 5
    const offset = (page-1) * pageSize// trang 2 bat dau tu, bo qua trang truoc
    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { specification: { [Op.like]: `%${search}%` } }
            ]
        };
    }
    const [products, totalProducts] = await Promise.all([
        db.Product.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset,
        }),
        db.Product.count({
            where: whereClause
        })
    ])
    return res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts
    })

}
export async function getProductById(req, res) {
    const {id} = req.params
    const product = await db.Product.findByPk(id, {
        include: [{
            model: db.ProductImage,
            as: 'product_images'
        }]
    })

    if(!product) {
        return res.status(404).json({
        message: 'Sản phẩm không tìm thấy'
        })
    }

    res.status(200).json({
        message: 'Lấy thông tin sản phẩm thành công',
        data: product
    })

}
export async function insertProduct(req, res) {
    
    const product = await db.Product.create(req.body)
    if(product) {
        return res.status(200).json({
        message: 'Thêm sản phẩm thành công',
        data: product
        })
    } else {
        return res.status(500).json({
        message: 'Thêm sản phẩm thất bại'
        })
    }   
}
export async function deleteProduct(req, res) {
    const {id} = req.params
    const deleted = await db.Product.destroy({
        where: {id}
    })
    if(deleted) {
        return res.status(200).json({
        message: 'Xóa sản phẩm thành công'
        })
    } else {
        return res.status(404).json({
        message: 'Sản phẩm không tìm thấy'
        })
    }
    

}
export async function updateProduct(req, res) {
    const { id } = req.params;
    const {name} = req.body;
    if (name !== undefined) {
        const existingProduct = await db.Product.findOne(
            {
                where: { name: name.trim(), id: { [Op.ne]: id } }
            });
        if (existingProduct) {
            return res.status(400).json({
                message: 'Sản phẩm với tên này đã tồn tại'
            });
        }
    }
    const updatedProduct = await db.Product.update(req.body, {
        where: { id }
    });
    if (updatedProduct[0] > 0) { 
        return res.status(200).json({
            message: 'Cập nhật sản phẩm thành công'
        });
    } else {
        return res.status(404).json({
            message: 'Sản phẩm không tìm thấy'
        });
    }
}


// [
//   {
//     "name": "iPhone 15 Pro Max",
//     "price": 32990000,
//     "oldprice": 34990000,
//     "image": "https://example.com/images/iphone-15-pro-max.jpg",
//     "description": "iPhone 15 Pro Max với khung viền Titan cao cấp, chip A17 Pro mạnh mẽ và hệ thống camera Pro.",
//     "specification": "Màn hình Super Retina XDR 6.7 inch, công nghệ ProMotion, cụm 3 camera 48MP.",
//     "buyturn": 450,
//     "quantity": 60,
//     "brand_id": 1,
//     "category_id": 1
//   },
//   {
//     "name": "Samsung Galaxy S24 Ultra",
//     "price": 31490000,
//     "oldprice": 33990000,
//     "image": "https://example.com/images/samsung-s24-ultra.jpg",
//     "description": "Samsung Galaxy S24 Ultra với Galaxy AI, khung viền Titan và bút S Pen tích hợp.",
//     "specification": "Màn hình Dynamic AMOLED 2X 6.8 inch, chip Snapdragon 8 Gen 3 for Galaxy, camera 200MP.",
//     "buyturn": 550,
//     "quantity": 70,
//     "brand_id": 4,
//     "category_id": 1
//   },
//   {
//     "name": "Xiaomi 14 Ultra",
//     "price": 29990000,
//     "oldprice": 32990000,
//     "image": "https://example.com/images/xiaomi-14-ultra.jpg",
//     "description": "Xiaomi 14 Ultra với hệ thống camera Leica thế hệ mới, thiết kế sang trọng.",
//     "specification": "Màn hình AMOLED C8 6.73 inch, chip Snapdragon 8 Gen 3, 4 camera 50MP.",
//     "buyturn": 120,
//     "quantity": 30,
//     "brand_id": 2,
//     "category_id": 1
//   },
//   {
//     "name": "Oppo Find X7 Ultra",
//     "price": 28990000,
//     "oldprice": 30000000,
//     "image": "https://example.com/images/oppo-find-x7-ultra.jpg",
//     "description": "Oppo Find X7 Ultra, flagship camera phone với cảm biến 1 inch và ống kính tele kép.",
//     "specification": "Màn hình AMOLED 6.82 inch, chip Snapdragon 8 Gen 3, camera Hasselblad.",
//     "buyturn": 90,
//     "quantity": 25,
//     "brand_id": 3,
//     "category_id": 1
//   },
//   {
//     "name": "Vivo X100 Pro",
//     "price": 24990000,
//     "oldprice": 26990000,
//     "image": "https://example.com/images/vivo-x100-pro.jpg",
//     "description": "Vivo X100 Pro đồng chế tác với ZEISS, camera tele siêu zoom và chip Dimensity 9300.",
//     "specification": "Màn hình AMOLED 6.78 inch 120Hz, chip MediaTek Dimensity 9300, sạc nhanh 100W.",
//     "buyturn": 75,
//     "quantity": 35,
//     "brand_id": 5,
//     "category_id": 1
//   },
//   {
//     "name": "OnePlus 12",
//     "price": 21990000,
//     "oldprice": 23490000,
//     "image": "https://example.com/images/oneplus-12.jpg",
//     "description": "OnePlus 12 mang lại hiệu năng flagship mượt mà với sạc siêu nhanh SUPERVOOC.",
//     "specification": "Màn hình 2K 120Hz ProXDR, chip Snapdragon 8 Gen 3, camera Hasselblad thế hệ 4.",
//     "buyturn": 60,
//     "quantity": 20,
//     "brand_id": 6,
//     "category_id": 1
//   },
//   {
//     "name": "Nubia Red Magic 9 Pro",
//     "price": 18990000,
//     "oldprice": 19990000,
//     "image": "https://example.com/images/nubia-red-magic-9-pro.jpg",
//     "description": "Gaming phone Red Magic 9 Pro với thiết kế trong suốt, quạt tản nhiệt RGB và chip siêu mạnh.",
//     "specification": "Màn hình phẳng 6.8 inch 120Hz, chip Snapdragon 8 Gen 3, pin 6500mAh.",
//     "buyturn": 85,
//     "quantity": 15,
//     "brand_id": 7,
//     "category_id": 1
//   },
//   {
//     "name": "iPhone 15",
//     "price": 22490000,
//     "oldprice": 24990000,
//     "image": "https://example.com/images/iphone-15.jpg",
//     "description": "iPhone 15 với Dynamic Island, camera chính 48MP và cổng sạc USB-C.",
//     "specification": "Màn hình Super Retina XDR 6.1 inch, chip A16 Bionic, camera kép.",
//     "buyturn": 310,
//     "quantity": 80,
//     "brand_id": 1,
//     "category_id": 1
//   },
//   {
//     "name": "Samsung Galaxy Z Fold 5",
//     "price": 35990000,
//     "oldprice": 40990000,
//     "image": "https://example.com/images/samsung-z-fold-5.jpg",
//     "description": "Điện thoại gập cao cấp Z Fold 5 với bản lề Flex không kẽ hở và màn hình lớn.",
//     "specification": "Màn hình chính 7.6 inch, màn hình phụ 6.2 inch, chip Snapdragon 8 Gen 2.",
//     "buyturn": 150,
//     "quantity": 40,
//     "brand_id": 4,
//     "category_id": 1
//   },
//   {
//     "name": "Xiaomi Redmi Note 13 Pro",
//     "price": 8990000,
//     "oldprice": 9490000,
//     "image": "https://example.com/images/redmi-note-13-pro.jpg",
//     "description": "Redmi Note 13 Pro tầm trung với camera 200MP và màn hình AMOLED 120Hz.",
//     "specification": "Màn hình 6.67 inch, chip Snapdragon 7s Gen 2, sạc nhanh 67W.",
//     "buyturn": 220,
//     "quantity": 100,
//     "brand_id": 2,
//     "category_id": 1
//   },
//   {
//     "name": "Samsung Galaxy A55",
//     "price": 9990000,
//     "oldprice": 10990000,
//     "image": "https://example.com/images/samsung-a55.jpg",
//     "description": "Galaxy A55 với khung viền kim loại, camera 50MP OIS và màn hình Super AMOLED.",
//     "specification": "Màn hình 6.6 inch 120Hz, chip Exynos 1480, kháng nước IP67.",
//     "buyturn": 300,
//     "quantity": 120,
//     "brand_id": 4,
//     "category_id": 1
//   },
//   {
//     "name": "Oppo Reno11 F",
//     "price": 8690000,
//     "oldprice": 9290000,
//     "image": "https://example.com/images/oppo-reno11-f.jpg",
//     "description": "Oppo Reno11 F thiết kế mỏng nhẹ, camera 64MP và sạc nhanh SUPERVOOC 67W.",
//     "specification": "Màn hình AMOLED 6.7 inch 120Hz, chip Dimensity 7050, kháng nước IP65.",
//     "buyturn": 180,
//     "quantity": 90,
//     "brand_id": 3,
//     "category_id": 1
//   }
// ]