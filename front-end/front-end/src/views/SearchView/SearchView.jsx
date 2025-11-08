import React, { useState } from 'react';
import { useNews } from '../../contexts/NewsContext';
import ArticleCard from '../../components/ArticleCard/ArticleCard';

const SearchView = () => {
    const { searchNews, searchResults } = useNews();
    const [keyword, setKeyword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        searchNews(keyword);
    };

    return (
        <div>
            <h2>Search Articles</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter keyword..."
                        required
                    />
                </label>
                <button type="submit">Search</button>
            </form>

            {searchResults && searchResults.length > 0 ? (      //asked copilot for conditional suggestion
                searchResults.map((article, idx) => (
                    <ArticleCard key={idx} article={article} />
                ))
            ) : (
                <p>No articles found</p>
            )}
        </div>
    );
};

export default SearchView;