import path from 'path';
import fs from 'fs';
import db from '../models';
import { Op } from 'sequelize';

export async function uploadImages(req, res) {
    if (!req.files || req.files.length === 0) {
        throw new Error("Không có tệp hình ảnh nào được tải lên");
    }
    const uploadedImagesPaths = req.files.map((file) =>
        path.basename(file.path).trim()
    );
    res.status(200).json({
        message: "Tải lên hình ảnh thành công",
        files: uploadedImagesPaths,
    });
}
export async function viewImage(req, res) {
    const { filename } = req.params;
    const imagePath = path.join(path.join(__dirname, '../uploads/'), filename);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({
                message: 'Hình ảnh không tồn tại'
            });
        }
        res.sendFile(imagePath)
    })
}
async function checkImageInUse(imageUrl) {
    const modelFields = {
        User: 'avatar',
        Product: 'image',
        Banner: 'image',
        Category: 'image',
        Brand: 'image',
        News: 'image'
    }
    const models = [db.User, db.Product, db.Banner, db.Category, db.Brand, db.News];
    for (let model of models) {
        const fieldName = modelFields[model.name];
        let query = {};
        query[fieldName] = imageUrl;
        const result = await model.findOne({
            where: query
        });
        if (result) {
            return true; // Hình ảnh đang được sử dụng
        }
    }
    return false; // Hình ảnh không được sử dụng
}
export async function deleteImage(req, res) {
    const { url: rawUrl } = req.body;
    const url = rawUrl.trim();
    try {
        if (await checkImageInUse(url)) {
            return res.status(400).json({
                message: "Không thể xóa hình ảnh vì nó đang được sử dụng",
            });
        }
        const filePath = path.join(__dirname, "../uploads/", path.basename(url));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({
                message: "Xóa hình ảnh thành công",
            });
        }
        return res.status(404).json({
            message: "Xóa hình ảnh thành công",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xóa hình ảnh: " + error.message,
        });
    }
}

