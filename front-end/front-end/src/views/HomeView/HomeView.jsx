import React, { useEffect } from "react";
import { useNews } from "../../contexts/NewsContext";
import ArticleCard from "../../components/ArticleCard/ArticleCard";

const HomeView = () => {
  const { topNews, fetchTopNews } = useNews();

  useEffect(() => {
    fetchTopNews();
  }, []);

  return (
    <div>
      <h1>Top News</h1>

      <div>
        {topNews.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}
      </div>
    </div>
  );
};

export default HomeView;