const express = require('express');
const router = express.Router();
const { getAllPosts, getCategoryPosts,getPostById, createPost } = require('../controllers/postController');

router.get('/posts', getAllPosts);

// 获取分类下的文章列表
router.get('/category/:id/posts', getCategoryPosts);

router.get('/posts/:id', getPostById);
router.post('/posts', createPost);



module.exports = router;