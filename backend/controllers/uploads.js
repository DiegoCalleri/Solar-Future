const path = require('path');

const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Файл не загружен" });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).send({
            message: "Файл успешно загружен",
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).send({ message: "Ошибка при загрузке файла" });
    }
};

module.exports = { uploadFile };
