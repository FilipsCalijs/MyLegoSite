import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./IntroHero.css";

const PLACEHOLDER_IMG = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

const CATEGORY_CARD_WIDTH = 240;
const BLOG_CARD_WIDTH = 320;

const IntroHero = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);

  const catGridRef = useRef();
  const postGridRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories:", err));
    axios.get("http://localhost:8081/posts?limit=10")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error loading posts:", err));
  }, []);

  // Категории
  const scrollCatLeft = () => {
    const grid = catGridRef.current;
    if (grid.scrollLeft <= 0) {
      grid.scrollTo({ left: grid.scrollWidth, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: -CATEGORY_CARD_WIDTH, behavior: "smooth" });
    }
  };
  const scrollCatRight = () => {
    const grid = catGridRef.current;
    if (grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 8) {
      grid.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: CATEGORY_CARD_WIDTH, behavior: "smooth" });
    }
  };

  // Посты/Блог
  const scrollPostLeft = () => {
    const grid = postGridRef.current;
    if (grid.scrollLeft <= 0) {
      grid.scrollTo({ left: grid.scrollWidth, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: -BLOG_CARD_WIDTH, behavior: "smooth" });
    }
  };
  const scrollPostRight = () => {
    const grid = postGridRef.current;
    if (grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 8) {
      grid.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      grid.scrollBy({ left: BLOG_CARD_WIDTH, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Welcome Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to BrickMania!</h1>
          <p>
            Tired of boring LEGO sites? Try something modern and simple.<br/>
            Explore, sell, discuss and share your LEGO bricks, minifigures and ideas.<br/>
            Create your own collection, share with the community, and join new discussions!
          </p>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="categories-section">
        <h2>Browse Categories</h2>
        <div className="category-slider">
          <button className="slider-btn left" aria-label="Scroll left" onClick={scrollCatLeft}>{"<"}</button>
          <div className="category-grid" ref={catGridRef} tabIndex="0">
            {categories.map(cat => (
              <Link to={`/category/${cat.id}`} className="category-card" key={cat.id}>
                <img src={cat.image_url || PLACEHOLDER_IMG} alt={cat.name} />
                <h4>{cat.name}</h4>
              </Link>
            ))}
          </div>
          <button className="slider-btn right" aria-label="Scroll right" onClick={scrollCatRight}>{">"}</button>
        </div>
      </section>

      {/* Latest Released from Other People */}
      <section className="latest-posts-section">
        <h2>Latest Released from Other People</h2>
        <div className="latest-posts-slider">
          <button className="slider-btn left" aria-label="Scroll left" onClick={scrollPostLeft}>{"<"}</button>
          <div className="latest-posts-grid" ref={postGridRef} tabIndex="0">
            {posts.length === 0 && (
              <div className="empty-posts">No posts yet... Your post can be the first!</div>
            )}
            {posts.map(post => (
              <Link to={`/post/${post.id}`} className="post-card" key={post.id}>
                <div className="post-title">{post.title}</div>
                <div className="post-tags">
                  {post.tags?.split(",").map(tag => (
                    <span className="post-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="post-meta">
                  by {post.author_name} {post.is_admin ? "(admin)" : ""}
                </div>
              </Link>
            ))}
          </div>
          <button className="slider-btn right" aria-label="Scroll right" onClick={scrollPostRight}>{">"}</button>
        </div>
      </section>
    </div>
  );
};

export default IntroHero;
