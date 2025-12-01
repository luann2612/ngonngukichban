import path from 'path';
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const destinationPath = path.join(__dirname,  '../uploads/');
        callback(null, destinationPath);
    },
    filename: function (req, file, callback) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        callback(null, newFileName);
    }  
})
const fileFilter = function(req, file, callback) {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Chỉ chấp nhận các tệp hình ảnh'), false);
    } 
}
const uploadImageMiddleware = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước tệp là 5MB
});
export default uploadImageMiddleware;
