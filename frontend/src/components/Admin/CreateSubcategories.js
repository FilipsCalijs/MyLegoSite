import React, { useEffect, useState } from 'react';
import { getCategories, addSubcategory } from '../../services';

const CreateSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('❌ Failed to load categories:', err);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!selectedCategoryId || !newSubcategory.trim()) {
      setMessage('⛔ Выберите категорию и введите подкатегорию');
      return;
    }

    try {
      await addSubcategory(newSubcategory.trim(), selectedCategoryId);
      setMessage('✅ Подкатегория добавлена');
      setNewSubcategory('');
    } catch (err) {
      console.error('❌ Ошибка при добавлении:', err);
      setMessage('⚠️ Ошибка при добавлении');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Добавить подкатегорию</h2>

      <label>Категория:</label>
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">-- Выберите категорию --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <br /><br />
      <label>Название подкатегории:</label>
      <input
        type="text"
        value={newSubcategory}
        onChange={(e) => setNewSubcategory(e.target.value)}
      />
      <br /><br />
      <button onClick={handleAdd}>Добавить</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateSubcategories;
