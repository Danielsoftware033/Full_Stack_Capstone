import React, { useEffect, useState } from "react";
import { useNews } from "../../contexts/NewsContext";
import { useArticles } from "../../contexts/SavedArticlesContext";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import './HomeView.css';

const HomeView = () => {
  const { topNews, fetchTopNews } = useNews();
  const { saveArticle } = useArticles();

  const [filter, setFilter] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    fetchTopNews();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredArticles(topNews);
    } else {
      setFilteredArticles(
        topNews.filter(article => article.bias_category === filter)
      );
    }
  }, [topNews, filter]);

  return (
    <div id="homeView">
      <div id="homeHeader">
        <h1 id="homeTitle">Latest News</h1>
        <p id="homeSubtitle">Balanced coverage from multiple perspectives</p>
        <p id="biasDisclaimer">
          Media bias categorizations sourced from <a href="https://adfontesmedia.com" target="_blank">Ad Fontes Media</a> and <a href="https://www.allsides.com" target="_blank">AllSides</a></p>
      </div>

      <div id="filterButtons">
        <button 
          className={filter === "all" ? "filterBtn active" : "filterBtn"} 
          onClick={() => setFilter("all")}
        >
          All Sources
        </button>
        <button 
          className={filter === "Left-Leaning" ? "filterBtn active" : "filterBtn"} 
          onClick={() => setFilter("Left-Leaning")}
        >
          Left-Leaning
        </button>
        <button 
          className={filter === "Center" ? "filterBtn active" : "filterBtn"} 
          onClick={() => setFilter("Center")}
        >
          Center
        </button>
        <button 
          className={filter === "Right-Leaning" ? "filterBtn active" : "filterBtn"} 
          onClick={() => setFilter("Right-Leaning")}
        >
          Right-Leaning
        </button>
      </div>

      {filter === "all" ? (
        <div id="categorizedView">
          <div className="categorySection">
            <h2 className="categoryTitle">Left-Leaning</h2>
            <div className="articlesGrid">
              {topNews.filter(article => article.bias_category === "Left-Leaning")
                .map((article) => (
                  <ArticleCard key={article.id} article={article} onSave={saveArticle} />
                ))}
            </div>
          </div>

          <div className="categorySection">
            <h2 className="categoryTitle">Center</h2>
            <div className="articlesGrid">
              {topNews.filter(article => article.bias_category === "Center")
                .map((article) => (
                  <ArticleCard key={article.id} article={article} onSave={saveArticle} />
                ))}
            </div>
          </div>

          <div className="categorySection">
            <h2 className="categoryTitle">Right-Leaning</h2>
            <div className="articlesGrid">
              {topNews.filter(article => article.bias_category === "Right-Leaning")
                .map((article) => (
                  <ArticleCard key={article.id} article={article} onSave={saveArticle} />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div id="filteredView">
          <div className="articlesGrid">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onSave={saveArticle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
