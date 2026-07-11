import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { QuizCard } from './components/QuizCard';
import { extractTextFromPdf } from './utils/pdfParser';
import './styles/App.css';

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'quiz'>('upload');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedFile)
      return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(selectedFile);

      const response = await fetch("http://localhost:8000/api/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          type: "quiz",
          count_of_questions: "5"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Ошибка генерации");
      }

      setQuestions(data.questions);
      setCurrentScreen('quiz');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Не удалось сгенерировать тест. Проверьте работу Ollama.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="app-main">
        {currentScreen === 'upload' ? (
          <>
            <h2 className="upload-title">Загрузите вашу лекцию</h2>
            <UploadZone onFileSelect={(file) => setSelectedFile(file)} />

            {error && <p className="error-indicator">{error}</p>}
            
            <button 
              disabled={!selectedFile || isLoading}
              onClick={handleGenerate}

              className={`generate-btn 
                ${selectedFile && !isLoading ? 'generate-btn-active' : 'generate-btn-disabled'}`
              }
            >
              {isLoading ? 'Генерация...' : 'Сгенерировать тест →'}
            </button>
          </>
        ) : (
          <div className="quiz-screen-container">
            <h2 className="quiz-main-title">Тест по лекции</h2>

            {/* Mapping по всем вопросам */}

            {questions.map((q, index) => (
            <QuizCard
                key={index}
                question={q.question}
                options={q.options}
                correctAnswer={q.correct_answer}
                onSelect={(opt) => console.log(`Вопрос ${index + 1}. Выбран ответ:`, opt)}
            />
            ))}

            <button
                onClick={() => setCurrentScreen('upload')}
                className="generate-btn generate-btn-active generate-btn-alt-lecture"
            >
              ← Загрузить другую лекцию
            </button>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;