import { useState } from 'react';
import '../styles/QuizCard.css'; 

interface QuestionProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

export const QuizCard = ({ question, options, onSelect }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
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
                isSelected ? 'quiz-option-btn-selected' : 'quiz-option-btn-unselected'
              }`}
            >
              <span className="text-base">{option}</span>
              
              {/* Радио-баттон */}
              <div className={`quiz-radio-circle ${
                isSelected ? 'quiz-radio-circle-selected' : 'quiz-radio-circle-unselected'
              }`}>
                {isSelected && <div className="quiz-radio-dot" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};