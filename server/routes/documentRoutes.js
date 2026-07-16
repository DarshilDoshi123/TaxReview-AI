const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  downloadDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect); // Secure all document routes

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id/download', downloadDocument);
router.route('/:id')
  .get(getDocumentById)
  .delete(deleteDocument);

module.exports = router;
