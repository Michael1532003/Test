import React from 'react';
import { useNavigate } from 'react-router-dom';

const Result = ({ score, total }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/quiz');
  };

  return (
    <div>
      <h1>Hasil Kuis</h1>
      <p>Benar: {score}</p>
      <p>Total Soal: {total}</p>
      <button onClick={handleRetry}>Ulangi</button>
    </div>
  );
};

export default Result;