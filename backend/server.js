const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Подключение к БД
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // <-- поменяй если надо
  database: "signup"
});

db.connect((err) => {
  if (err) console.log("❌ MYSQL CONNECT ERROR:", err);
  else console.log("✅ MYSQL CONNECTED");
});

// Роут: Регистрация
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO login (Name, Email, Password) VALUES (?, ?, ?)";
  const values = [req.body.name, req.body.email, req.body.password];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("DB error");
    res.status(200).json("Success");
  });
});

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login WHERE Email = ? AND Password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log("❌ LOGIN ERROR:", err);
      return res.status(500).json("Error");
    }

    if (data.length > 0) {
      console.log("✅ LOGIN SUCCESS");
      return res.status(200).json({ 
        message: "Success", 
        name: data[0].Name, 
        id: data[0].ID // 👈 обязательно ID (большими)
      });
    } else {
      console.log("❌ LOGIN FAILED");
      return res.status(401).json("Invalid credentials");
    }
  });
});


// ➕ Добавить продукт
app.post('/add-product', (req, res) => {
  const { user_id, category, my_price, quantity, market_price } = req.body;

  if (!user_id) {
    return res.status(400).json("Missing user_id");
  }

  const sql = `
    INSERT INTO products (user_id, category, my_price, quantity, market_price)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [user_id, category, my_price, quantity, market_price];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("❌ ADD PRODUCT ERROR:", err);
      return res.status(500).json("Insert failed");
    }
    res.status(200).json("Product added");
  });
});

// 📦 Получить все продукты пользователя
app.get('/my-products/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM products WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});

// 🗑 Удалить продукт
app.delete('/delete-product/:id', (req, res) => {
  const productId = req.params.id;
  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [productId], (err) => {
    if (err) {
      console.error("❌ DELETE PRODUCT ERROR:", err);
      return res.status(500).json("Delete failed");
    }
    res.status(200).json("Product deleted");
  });
});

// ✏️ Обновить продукт
app.put('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const { category, my_price, quantity, market_price } = req.body;

  const sql = `
    UPDATE products
    SET category = ?, my_price = ?, quantity = ?, market_price = ?
    WHERE id = ?
  `;

  const values = [category, my_price, quantity, market_price, productId];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ UPDATE PRODUCT ERROR:", err);
      return res.status(500).json("Update failed");
    }
    res.status(200).json("Product updated");
  });
});



app.listen(8081, () => {
  console.log("🚀 Server listening on port 8081");
});
