const uploadRouter = require('express').Router();
const upload = require('../middlewares/upload');
const { checkAuth } = require('../middlewares/auth');
const { checkAdmin } = require('../middlewares/checkAdmin');
const { uploadFile } = require('../controllers/uploads');

// POST /api/uploads - загрузка одного файла (только для админов)
uploadRouter.post('/uploads', checkAuth, checkAdmin, upload.single('file'), uploadFile);

module.exports = uploadRouter;
