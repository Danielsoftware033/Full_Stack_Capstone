import React, { useEffect, useState } from "react";
import { useArticles } from "../../contexts/SavedArticlesContext";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import "./SavedView.css";

const SavedPage = () => {
  const { savedArticles, removeSavedArticle, fetchSavedArticles } = useArticles(); 
  const [filter, setFilter] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredArticles(savedArticles);
    } else {
      setFilteredArticles(
        savedArticles.filter(article => article.bias_category === filter)
      );  
    }
  }, [filter, savedArticles]);  //copilot suggested a co-dependency on savedArticles to update filteredArticles when savedArticles changes

  return (
    <div id="savedView">
      <div id="savedContainer">
        <div id="savedHeader">
          <h1 id="savedTitle">Saved Articles</h1>
          <p id="savedSubtitle">Your collection of saved articles ({filteredArticles.length})</p>
        </div>

        <div id="filterSection">
          <span id="filterLabel">Filter by bias:</span>
          <div id="filterButtons">
            <button 
              className={`filterBtn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              className={`filterBtn ${filter === "Left-Leaning" ? "active" : ""}`}
              onClick={() => setFilter("Left-Leaning")}
            >
              Left-Leaning
            </button>
            <button 
              className={`filterBtn ${filter === "Center" ? "active" : ""}`}
              onClick={() => setFilter("Center")}
            >
              Center
            </button>
            <button 
              className={`filterBtn ${filter === "Right-Leaning" ? "active" : ""}`}
              onClick={() => setFilter("Right-Leaning")}
            >
              Right-Leaning
            </button>
          </div>
        </div>

        <div id="articlesGrid">
          {filteredArticles.length > 0 ? 
            filteredArticles.map((article, idx) => (
              <ArticleCard key={idx} article={article} onRemove={removeSavedArticle} />
            ))
            : 
            <div id="emptyState">
              <p id="emptyMessage">No articles found.</p>
              <p id="emptyHint">Try adjusting your filter or save some articles to see them here.</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
