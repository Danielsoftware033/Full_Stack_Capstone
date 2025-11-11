import React, { useEffect, useState } from "react";
import { useArticles } from "../../contexts/SavedArticlesContext";
import ArticleCard from "../../components/ArticleCard/ArticleCard";

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
    <div className="saved-page">
      <h2>Saved Articles</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("Left-Leaning")}>Left-Leaning</button>
        <button onClick={() => setFilter("Center")}>Center</button>
        <button onClick={() => setFilter("Right-Leaning")}>Right-Leaning</button>
      </div>

      <div className="saved-articles">
        {filteredArticles.length > 0 ? 
          filteredArticles.map((article, idx) => (
            <ArticleCard key={idx} article={article} onRemove={removeSavedArticle} />
          ))
          : 
          <p>No articles found.</p>
        }
      </div>
    </div>
  );
};

export default SavedPage;
