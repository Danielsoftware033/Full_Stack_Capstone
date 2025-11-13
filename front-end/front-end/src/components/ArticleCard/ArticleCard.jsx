import React from "react";
import './ArticleCard.css';

const ArticleCard = ({ article, onSave, onRemove }) => {
  return (
    <div className="articleCard">
      <div className="cardImage">
        <img src={article.image_url} alt={article.title} />
        <span className={`biasLabel ${article.bias_category?.replace('-', '').replace(' ', '')}`}>
          {article.bias_category}
        </span>
      </div>
      
      <div className="cardContent">
        <h3 className="cardTitle">{article.title}</h3>
        
        <p className="cardDescription">{article.description}</p>
        
        <div className="cardFooter">
          <p className="cardSource">
            <span className="sourceLabel">Source:</span> {article.source_name}
          </p>
          
          <div className="cardActions">
            <a 
              href={article.url} 
              target="_blank" 
              className="readMoreBtn"
            >Read More</a>
            
            {onSave && (
              <button 
                onClick={() => onSave(article.id)} 
                className="actionBtn saveBtn"
              >Save</button>
            )}

            {onRemove && (
              <button 
                onClick={() => onRemove(article.id)} 
                className="actionBtn removeBtn"
              >Remove</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;