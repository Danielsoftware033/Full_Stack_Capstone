import React, { useEffect } from "react";
import { useNews } from "../../contexts/NewsContext";
import { useArticles } from "../../contexts/SavedArticlesContext"
import ArticleCard from "../../components/ArticleCard/ArticleCard";


const HomeView = () => {
  const { topNews, fetchTopNews } = useNews();
  const {saveArticle} = useArticles();


  useEffect(() => {
    fetchTopNews();
  }, []);

  return (
    <div>
      <h1>Top News</h1>

      <div>
        {topNews.map((article, idx) => (
          <ArticleCard key={idx} article={article} onSave={saveArticle}/>
        ))}
      </div>
    </div>
  );
};

export default HomeView;