const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook, getCategories } = require('../controllers/bookController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/categories', getCategories);
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', auth, admin, createBook);
router.put('/:id', auth, admin, updateBook);
router.delete('/:id', auth, admin, deleteBook);

module.exports = router;
