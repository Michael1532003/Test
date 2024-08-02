import axios from 'axios';

const CACHE_KEY = 'cachedQuestions';

export const fetchQuestions = async () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=boolean');
      localStorage.setItem(CACHE_KEY, JSON.stringify(response.data.results));
      return response.data.results;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  };
