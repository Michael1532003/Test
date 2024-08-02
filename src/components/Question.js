import React from 'react';

const Question = ({ question, correctAnswer, handleAnswer }) => {
  return (
    <div>
      <h2>{question}</h2>
      <div>
        <button onClick={() => handleAnswer('True')}>True</button>
        <button onClick={() => handleAnswer('False')}>False</button>
      </div>
    </div>
  );
};

export default Question;