import { useState } from 'react';
import '../styles/QuizCard.css'; 

interface QuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onSelect: (option: string) => void;
}

export const QuizCard = ({ question, options, correctAnswer, onSelect }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(option === correctAnswer);
    onSelect(option);
  };

  return (
    <div className="quiz-card">
      <h3 className="quiz-question">{question}</h3>
      
      <div className="quiz-options-list">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          
          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`quiz-option-btn ${
                isSelected ? 'quiz-option-btn-selected' : 'quiz-option-btn-unselected'} ${
                (isSelected && isCorrect) ? 'quiz-option-btn-correct' : ''} ${
                (isSelected && !isCorrect) ? 'quiz-option-btn-incorrect' : ''
              }`}
            >
              <span className="text-base">{option}</span>
              
              {/* Радио-баттон */}
              <div className={`quiz-radio-circle ${
                (isSelected && isCorrect) ? 'quiz-radio-circle-correct' : ''} ${
                (isSelected && !isCorrect) ? 'quiz-radio-circle-incorrect' : ''
              }`}>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};