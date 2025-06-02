const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // измени на свой пароль
  database: "signup"
});

db.connect(err => {
  if (err) console.log("❌ MYSQL CONNECT ERROR:", err);
  else console.log("✅ MYSQL CONNECTED");
});

// Регистрация
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO login (Name, Email, Password, is_admin) VALUES (?, ?, ?, false)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("DB error");
    res.status(200).json("Success");
  });
});

// Логин
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

// Продукты
app.post('/add-product', (req, res) => {
  const { user_id, category, subcategory, my_price, quantity, market_price } = req.body;
  if (!user_id || !category) return res.status(400).json("Missing data");

  const sql = `
    INSERT INTO products (user_id, category, subcategory, my_price, quantity, market_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [user_id, category, subcategory, my_price, quantity, market_price];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Product added");
  });
});

app.put('/update-product/:id', (req, res) => {
  const { category, subcategory, my_price, quantity, market_price } = req.body;
  const sql = `
    UPDATE products
    SET category = ?, subcategory = ?, my_price = ?, quantity = ?, market_price = ?
    WHERE id = ?
  `;
  const values = [category, subcategory, my_price, quantity, market_price, req.params.id];
  db.query(sql, values, (err) => {
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

// Категории
app.post('/add-category', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json("Missing name");
  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err) => {
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
  const id = req.params.id;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Category deleted");
  });
});

// 🔄 Обновить категорию
app.put('/update-category/:id', (req, res) => {
  const { name } = req.body;
  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, req.params.id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Category updated");
  });
});

// Подкатегории
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
  const categoryId = req.params.category_id;
  db.query("SELECT * FROM subcategories WHERE category_id = ?", [categoryId], (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});

app.delete('/delete-subcategory/:id', (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM subcategories WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Subcategory deleted");
  });
});

// 🔄 Обновить подкатегорию
app.put('/update-subcategory/:id', (req, res) => {
  const { name, category_id } = req.body;
  db.query(
    "UPDATE subcategories SET name = ?, category_id = ? WHERE id = ?",
    [name, category_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json("Update failed");
      res.status(200).json("Subcategory updated");
    }
  );
});

app.listen(8081, () => {
  console.log("🚀 Server listening on port 8081");
});

// Обновить категорию
app.put('/edit-category/:id', (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Category updated");
  });
});

// Обновить подкатегорию
app.put('/edit-subcategory/:id', (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  db.query("UPDATE subcategories SET name = ? WHERE id = ?", [name, id], (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Subcategory updated");
  });
});

// Получить все продукты с данными пользователя (для админа)
app.get('/all-products-with-users', (req, res) => {
  const query = `
    SELECT p.*, l.username
    FROM products p
    JOIN login l ON p.user_id = l.id
    ORDER BY l.username ASC, p.id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Ошибка при получении продуктов:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
    res.status(200).json(results);
  });
});

app.get('/all-products-with-users', (req, res) => {
  const sql = `
    SELECT products.*, login.username 
    FROM products 
    LEFT JOIN login ON products.user_id = login.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ SQL error in /all-products-with-users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(result);
  });
});

app.put('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const { category, my_price, quantity, market_price } = req.body;

  const sql = `
    UPDATE products SET 
      category = ?, 
      my_price = ?, 
      quantity = ?, 
      market_price = ?
    WHERE id = ?
  `;

  db.query(sql, [category, my_price, quantity, market_price, productId], (err, result) => {
    if (err) {
      console.error("❌ Update error:", err);
      return res.status(500).json({ error: "Failed to update product" });
    }
    res.json({ message: "✅ Product updated" });
  });
});

