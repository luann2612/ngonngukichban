import fs from 'fs';
import path from 'path';

const validateImageExists = (req, res, next) => {
    const imageName = req.body.image;

    if (imageName && !imageName.startsWith('http://') && !imageName.startsWith('https://')) {
        const imagePath = path.join(__dirname, '../uploads/', imageName);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                message: 'Hình ảnh không tồn tại trên máy chủ'
            });
        }
    }

    next();
}  
export default validateImageExists;