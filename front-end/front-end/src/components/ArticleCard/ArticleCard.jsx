import React from "react";

const ArticleCard = ({ article }) => {
  return (
    <div>
      <img src={article.image_url} alt={article.title} width={150} />
      <h3>{article.title}</h3>
      <h4>{article.bias_category}</h4>
      <p>{article.description}</p>
      <a href={article.url} target="_blank">
        Read more
      </a>
    </div>
  );
};

export default ArticleCard;