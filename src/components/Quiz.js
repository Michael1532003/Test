import React, { useState, useEffect } from 'react';
import { fetchQuestions } from '../utils/api';
import { startTimer } from '../utils/timer';
import { saveQuizState, loadQuizState, clearQuizState } from '../utils/localstorage';
import Question from './Question';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // Waktu dalam detik, misalnya 5 menit = 300 detik
  const [answers, setAnswers] = useState([]); // Untuk menyimpan jawaban yang diberikan
  
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetchQuestions();
        if (response && Array.isArray(response)) {
          setQuestions(response);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('Error fetching questions. Please try again later.');
      }
    };
    getQuestions();
  }, []);

 useEffect(() => {
  const savedState = loadQuizState();
  if (savedState && !savedState.quizFinished) {
    setQuestions(savedState.questions);
    setCurrentQuestion(savedState.currentQuestion);
    setScore(savedState.score);
    setTimeLeft(savedState.timeLeft);
    setAnswers(savedState.answers);
  } else {
    const getQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError('Error fetching questions. Please try again later.');
      }
    };
    getQuestions();
  }
}, []);

  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      // Start the timer
      const timer = startTimer(timeLeft, () => setQuizFinished(true));
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            setQuizFinished(true); // Akhiri kuis jika waktu habis
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timerId);
        clearInterval(timer); // Untuk memastikan timer dibersihkan
      };
    }
  }, [questions, quizFinished, timeLeft]);
  
  useEffect(() => {
    if (!quizFinished) {
      saveQuizState({
        questions,
        currentQuestion,
        score,
        quizFinished,
        timeLeft,
        answers,
      });
    } else {
      clearQuizState(); // Hapus state jika kuis selesai
    }
  }, [questions, currentQuestion, score, quizFinished, timeLeft, answers]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (questions[currentQuestion].correct_answer === answer) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (quizFinished) {
    return (
      <div>
        <h1>Hasil Kuis</h1>
        <p>Benar: {score}</p>
        <p>Salah: {questions.length - score}</p>
        <p>Total Soal: {questions.length}</p>
        <p>Jawaban yang diberikan: {answers.length}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Quiz</h1>
      <p>Total Soal: {questions.length}</p>
      <p>Soal yang dikerjakan: {currentQuestion + 1} dari {questions.length}</p>
      <p>Waktu tersisa: {Math.floor(timeLeft / 60)}:{('0' + timeLeft % 60).slice(-2)}</p>
      <Question
        question={questions[currentQuestion].question}
        correctAnswer={questions[currentQuestion].correct_answer}
        handleAnswer={handleAnswer}
      />
    </div>
  );
};

export default Quiz;