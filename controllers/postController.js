// controllers/postController.js
const { pool } = require('../config/database');


// 获取文章列表
const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT 
     id, 
    title, 
    content, 
    created_at, 
    category_id 
     FROM posts ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取分类下的文章列表
const getCategoryPosts =  async (req, res) => {
   
    try {
      const categoryId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;

  

      // 获取分类信息
      const [category] = await pool.query(
        'SELECT id, name FROM categories WHERE id = ?',
        [categoryId]
      );

      if (!category[0]) {
        return res.status(404).json({ 
          success: false,
          message: 'Category not found' 
        });
      }

      // 获取文章总数
      const [totalRows] = await pool.query(
        'SELECT COUNT(*) as total FROM posts WHERE category_id = ?',
        [categoryId]
      );

      // 获取分页的文章列表
      const [posts] = await pool.query(
        `SELECT 
          id, 
          title, 
          author,
          cover,
          description,  
          created_at, 
          category_id 
        FROM posts 
        WHERE category_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`,
        [categoryId, pageSize, offset]
      );

      res.json({
        success: true,
        data: {
          category: category[0],
          posts,
          pagination: {
            total: totalRows[0].total,
            page,
            pageSize,
            totalPages: Math.ceil(totalRows[0].total / pageSize)
          }
        }
      });
    } catch (error) {
      console.error('Error in getCategoryPosts:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    } finally {
    
      console.log('getCategoryPosts end')
    }
  };

// 获取单篇文章
const getPostById = async (req, res) => {
  const query = `
    SELECT posts.*, categories.name as category_name
    FROM posts
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE posts.id = ?
  `;

  try {
    const [rows] = await pool.query(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 创建文章
const createPost = async (req, res) => {
try {
 const {
      title,
      description = '',
      cover = null,
      content,
      category,
      recommendation
    } = req.body;

  
  
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (title, description, cover, content, category_id, recommendation, created_at, updated_at) VALUES (?, ?, ? , ?, ?, ?, now(), now())',
      [title, description,  JSON.stringify(cover), content, category, recommendation ]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    console.log('INSERT error', error);
    res.status(500).json({ error: error.message });
  }
} catch (error) {
  console.log('error', error);
}
};

module.exports = {
  getAllPosts,
  getCategoryPosts,
  getPostById,
  createPost
};