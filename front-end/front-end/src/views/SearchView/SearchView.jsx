import React, { useState, useEffect } from "react";
import { useNews } from "../../contexts/NewsContext";
import { useArticles } from "../../contexts/SavedArticlesContext";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import './SearchView.css';

const SearchView = () => {
  const { searchNews, searchResults } = useNews();
  const { saveArticle } = useArticles();

  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    searchNews(keyword);
  };

  useEffect(() => {
    if (filter === "all") {
      setFilteredResults(searchResults);
    } else {
      setFilteredResults(
        searchResults.filter((a) => a.bias_category === filter)
      );
    }
  }, [searchResults, filter]);

  return (
    <div id="searchView">
      <div id="searchHeader">
        <h2 id="searchTitle">Search Articles</h2>
        <p id="searchSubtitle">Find news articles by keyword from multiple sources</p>
      </div>

      <form id="searchForm" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          className="searchInput"
          required
        />
        <button type="submit" className="searchBtn">Search</button>
      </form>

      {searchResults.length > 0 && (
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
      )}

      {filter === "all" ? (
        <div id="categorizedResults">
          {searchResults.length > 0 && (
            <>
              <div className="categorySection">
                <h3 className="categoryTitle">Left-Leaning</h3>
                <div className="articlesGrid">
                  {searchResults.filter((a) => a.bias_category === "Left-Leaning")
                    .map((a, idx) => (
                      <ArticleCard key={idx} article={a} onSave={saveArticle} />
                    ))}
                </div>
              </div>

              <div className="categorySection">
                <h3 className="categoryTitle">Center</h3>
                <div className="articlesGrid">
                  {searchResults.filter((a) => a.bias_category === "Center")
                    .map((a, idx) => (
                      <ArticleCard key={idx} article={a} onSave={saveArticle} />
                    ))}
                </div>
              </div>

              <div className="categorySection">
                <h3 className="categoryTitle">Right-Leaning</h3>
                <div className="articlesGrid">
                  {searchResults.filter((a) => a.bias_category === "Right-Leaning")
                    .map((a, idx) => (
                      <ArticleCard key={idx} article={a} onSave={saveArticle} />
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div id="filteredResults">
          <div className="articlesGrid">
            {filteredResults.map((a, idx) => (
              <ArticleCard key={idx} article={a} onSave={saveArticle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;
