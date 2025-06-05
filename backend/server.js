const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// MYSQL CONNECT
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // или твой пароль
  database: "signup"
});
db.connect(err => {
  if (err) console.log("❌ MYSQL CONNECT ERROR:", err);
  else console.log("✅ MYSQL CONNECTED");
});

// --- Пользователи ---
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO login (Name, Email, Password, is_admin) VALUES (?, ?, ?, false)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("DB error");
    res.status(200).json("Success");
  });
});
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login WHERE Email = ? AND Password = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.status(500).json("Error");
    if (data.length > 0) {
      return res.status(200).json({
        message: "Success",
        name: data[0].Name,
        id: data[0].ID,
        is_admin: data[0].is_admin === 1
      });
    } else {
      return res.status(401).json("Invalid credentials");
    }
  });
});

// --- Категории ---
app.post('/add-category', (req, res) => {
  const { name, image_url } = req.body;
  if (!name || !image_url) return res.status(400).json("Missing data");
  db.query("INSERT INTO categories (name, image_url) VALUES (?, ?)", [name, image_url], (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Category added");
  });
});
app.get('/categories', (req, res) => {
  db.query("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.delete('/delete-category/:id', (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Category deleted");
  });
});
app.put('/edit-category/:id', (req, res) => {
  const { name, image_url } = req.body;
  db.query("UPDATE categories SET name = ?, image_url = ? WHERE id = ?", [name, image_url, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Category updated");
  });
});

// --- Подкатегории ---
app.post('/add-subcategory', (req, res) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json("Missing data");
  db.query("INSERT INTO subcategories (name, category_id) VALUES (?, ?)", [name, category_id], (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Subcategory added");
  });
});
app.get('/subcategories', (req, res) => {
  db.query("SELECT * FROM subcategories", (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.get('/subcategories/:category_id', (req, res) => {
  db.query("SELECT * FROM subcategories WHERE category_id = ?", [req.params.category_id], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.delete('/delete-subcategory/:id', (req, res) => {
  db.query("DELETE FROM subcategories WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Subcategory deleted");
  });
});
app.put('/edit-subcategory/:id', (req, res) => {
  const { name, category_id } = req.body;
  db.query("UPDATE subcategories SET name = ?, category_id = ? WHERE id = ?", [name, category_id, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Subcategory updated");
  });
});

// --- Продукты (товары) ---
app.post('/add-product', (req, res) => {
  const { user_id, category, subcategory, name, my_price, quantity, image_url } = req.body;
  if (!user_id || !category || !subcategory || !name) return res.status(400).json("Missing data");
  const sql = `
    INSERT INTO products (user_id, category, subcategory, name, my_price, quantity, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [user_id, category, subcategory, name, my_price, quantity, image_url];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Product added");
  });
});
app.put('/update-product/:id', (req, res) => {
  const { category, subcategory, name, my_price, quantity, image_url } = req.body;
  const sql = `
    UPDATE products SET
      category = ?, subcategory = ?, name = ?, my_price = ?, quantity = ?, image_url = ?
    WHERE id = ?
  `;
  db.query(sql, [category, subcategory, name, my_price, quantity, image_url, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Product updated");
  });
});
app.delete('/delete-product/:id', (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Product deleted");
  });
});
app.get('/my-products/:userId', (req, res) => {
  db.query("SELECT * FROM products WHERE user_id = ?", [req.params.userId], (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});
app.get('/all-products', (req, res) => {
  db.query("SELECT p.*, l.Name as username FROM products p JOIN login l ON p.user_id = l.ID", (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});
// Вывести продукты по subcategory id (для публичного списка)
app.get('/products-by-subcategory/:subcat_id', (req, res) => {
  // Получаем имя подкатегории по id
  db.query("SELECT name FROM subcategories WHERE id = ?", [req.params.subcat_id], (err, subcatRows) => {
    if (err || !subcatRows.length) return res.status(404).json("Subcategory not found");
    const subcatName = subcatRows[0].name;
    db.query("SELECT * FROM products WHERE subcategory = ?", [subcatName], (err, rows) => {
      if (err) return res.status(500).json("Error");
      res.status(200).json(rows);
    });
  });
});


// --- БЛОГ: ПОСТЫ ---
app.get('/posts', (req, res) => {
  const limit = req.query.limit ? `LIMIT ${parseInt(req.query.limit)}` : '';
  const sql = `
    SELECT posts.*, login.Name as author_name, login.is_admin
    FROM posts
    JOIN login ON posts.user_id = login.ID
    ORDER BY posts.created_at DESC ${limit}
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.get('/posts/:id', (req, res) => {
  const sql = `
    SELECT posts.*, login.Name as author_name, login.is_admin
    FROM posts
    JOIN login ON posts.user_id = login.ID
    WHERE posts.id = ?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json("Error");
    if (!rows[0]) return res.status(404).json("Not found");
    res.status(200).json(rows[0]);
  });
});
app.post('/posts', (req, res) => {
  const { user_id, title, tags, body } = req.body;
  if (!user_id || !title || !tags || !body) return res.status(400).json("Missing data");
  const sql = "INSERT INTO posts (user_id, title, tags, body) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, title, tags, body], (err, result) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json({ id: result.insertId });
  });
});
app.put('/posts/:id', (req, res) => {
  const { title, tags, body } = req.body;
  const sql = "UPDATE posts SET title = ?, tags = ?, body = ? WHERE id = ?";
  db.query(sql, [title, tags, body, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Post updated");
  });
});
app.delete('/posts/:id', (req, res) => {
  db.query("DELETE FROM posts WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Post deleted");
  });
});

// --- Теги (только для админа) ---
app.get('/tags', (req, res) => {
  db.query("SELECT * FROM tags ORDER BY name ASC", (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.post('/tags', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json("Missing name");
  db.query("INSERT INTO tags (name) VALUES (?)", [name], (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Tag added");
  });
});
app.put('/tags/:id', (req, res) => {
  const { name } = req.body;
  db.query("UPDATE tags SET name = ? WHERE id = ?", [name, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Tag updated");
  });
});
app.delete('/tags/:id', (req, res) => {
  db.query("DELETE FROM tags WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Tag deleted");
  });
});

// --- Комментарии к постам ---
app.get('/comments/:post_id', (req, res) => {
  const sql = `
    SELECT comments.*, login.Name as author_name, login.is_admin
    FROM comments
    JOIN login ON comments.user_id = login.ID
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `;
  db.query(sql, [req.params.post_id], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
app.post('/comments', (req, res) => {
  const { post_id, user_id, text } = req.body; // <--- тут text
  if (!post_id || !user_id || !text) return res.status(400).json("Missing data");
  db.query(
    "INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)",
    [post_id, user_id, text],
    (err, result) => {
      if (err) return res.status(500).json("Insert failed");
      res.status(200).json({ id: result.insertId });
    }
  );
});



app.delete('/comments/:id', (req, res) => {
  db.query("DELETE FROM comments WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Comment deleted");
  });
});

app.listen(8081, () => {
  console.log("🚀 Server listening on port 8081");
});

app.post('/comments', (req, res) => {
  const { post_id, user_id, body } = req.body;
  if (!post_id || !user_id || !body) return res.status(400).json("Missing data");
  db.query("INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)", [post_id, user_id, body], (err, result) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json({ id: result.insertId });
  });
});

// Вернуть все подкатегории и для каждой посчитать сколько товаров (products)
app.get('/subcategories-by-category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  // Выбрать все подкатегории данной категории и для каждой посчитать товары
  const sql = `
    SELECT s.*, 
      (SELECT COUNT(*) FROM products p WHERE p.subcategory = s.name) as count
    FROM subcategories s
    WHERE s.category_id = ?
  `;
  db.query(sql, [categoryId], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
// --- Комментарии к постам ---

// Получить все комментарии к посту
app.get('/comments/:post_id', (req, res) => {
  const sql = `
    SELECT comments.*, login.Name as author_name, login.is_admin
    FROM comments
    JOIN login ON comments.user_id = login.ID
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `;
  db.query(sql, [req.params.post_id], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});

// Добавить комментарий (любому авторизованному)
app.post('/comments', (req, res) => {
  const { post_id, user_id, text } = req.body;
  if (!post_id || !user_id || !text) return res.status(400).json("Missing data");
  db.query(
    "INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)",
    [post_id, user_id, text],
    (err, result) => {
      if (err) return res.status(500).json("Insert failed");
      res.status(200).json({ id: result.insertId });
    }
  );
});

// Изменить комментарий (только свой или админ)
app.put('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const { text, user_id, is_admin } = req.body;
  if (!text || !user_id) return res.status(400).json("Missing data");

  db.query("SELECT user_id FROM comments WHERE id = ?", [commentId], (err, rows) => {
    if (err || !rows.length) return res.status(404).json("Comment not found");

    const ownerId = rows[0].user_id;
    if (String(user_id) !== String(ownerId) && !is_admin) {
      return res.status(403).json("Forbidden");
    }

    db.query("UPDATE comments SET text = ? WHERE id = ?", [text, commentId], (err) => {
      if (err) return res.status(500).json("Update failed");
      res.status(200).json("Comment updated");
    });
  });
});


// Удалить комментарий (только свой или админ)
app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  // Важно! Если используешь axios, передавай user_id и is_admin в data!
  const { user_id, is_admin } = req.body;

  db.query("SELECT user_id FROM comments WHERE id = ?", [commentId], (err, rows) => {
    if (err || !rows.length) return res.status(404).json("Comment not found");

    const ownerId = rows[0].user_id;
    if (parseInt(user_id) !== ownerId && !is_admin) {
      return res.status(403).json("Forbidden");
    }

    db.query("DELETE FROM comments WHERE id = ?", [commentId], (err) => {
      if (err) return res.status(500).json("Delete failed");
      res.status(200).json("Comment deleted");
    });
  });
});


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_gmail@gmail.com',   // твой gmail (или другой SMTP)
    pass: 'your_app_password'       // app password (не обычный пароль, а app-specific!)
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: "All fields required" });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'ifilipscalijs@gmail.com',
    subject: `[HELP FORM] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("MAIL SEND ERROR:", error); // ← вот тут и будет причина!
      return res.status(500).json({ error: "Mail send failed" });
    } else {
      res.json({ success: true });
    }
  });
});
// server.js
app.get('/products-by-subcategory/:subcat_id', (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      l.Name AS seller_name, 
      l.Email AS seller_email
    FROM products p
    JOIN login l ON p.user_id = l.ID
    WHERE p.subcategory = ?
  `;
  db.query(sql, [req.params.subcat_id], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});
