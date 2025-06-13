import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./IntroHero.css";
import image from "../images/logo.png"

const PLACEHOLDER_IMG = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";


const CATEGORY_CARD_WIDTH = 240;
const BLOG_CARD_WIDTH = 320;

const IntroHero = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [allTags, setAllTags] = useState([]);


  const catGridRef = useRef();
  const postGridRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories:", err));
  
    axios.get("http://localhost:8081/posts?limit=10")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error loading posts:", err));
  
    axios.get("http://localhost:8081/tags")
      .then(res => setAllTags(res.data))
      .catch(err => console.error("Error loading tags:", err));
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

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportName("");
      setReportEmail("");
      setReportMessage("");
    alert("sent to support group");
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
  <div className="hero-joined">
    <div className="hero-info">
      <h1>Welcome to BrickMania!</h1>
      <p>
        Tired of boring LEGO sites? Try something modern and simple.<br/>
        Explore, sell, discuss and share your LEGO bricks, minifigures and ideas.<br/>
        Create your own collection, share with the community, and join new discussions!
      </p>
      <a className="explore-btn" href="/blog">Explore Now</a>
    </div>
    <div className="hero-logo">
      <img
        src={image}
        alt="BrickMania Banner"
      />
    </div>
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
                {post.tags?.split(",").map(tag => {
                  const cleaned = tag.trim();
                  const exists = allTags.some(t => t.name === cleaned);
                  return (
                    <span className="post-tag" key={cleaned}>
                      {exists ? cleaned : <del>{cleaned}</del>}
                    </span>
                  );
                })}
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
      <section className="report-section">
  <h2>See something suspicious on the forum? Contact us now!</h2>
  <form className="report-form" onSubmit={handleReportSubmit}>
    <input
      type="text"
      placeholder="Your Name"
      value={reportName}
      onChange={e => setReportName(e.target.value)}
      required
    />
    <input
      type="email"
      placeholder="Your Email"
      value={reportEmail}
      onChange={e => setReportEmail(e.target.value)}
      required
    />
    <textarea
      placeholder="Describe the problem..."
      value={reportMessage}
      onChange={e => setReportMessage(e.target.value)}
      required
      rows={3}
    />
    <button type="submit">Send Report</button>
  </form>
</section>

    </div>
  );
};

export default IntroHero;
