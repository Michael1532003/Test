// utils/localStorage.js
export const saveQuizState = (state) => {
    localStorage.setItem('quizState', JSON.stringify(state));
  };
  
  export const loadQuizState = () => {
    const state = localStorage.getItem('quizState');
    return state ? JSON.parse(state) : null;
  };
  
  export const clearQuizState = () => {
    localStorage.removeItem('quizState');
  };
  