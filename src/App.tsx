import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { QuizCard } from './components/QuizCard';
import './styles/App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'quiz'>('upload');

  return (
    <div className="app-container">
      <Header />
      
      <main className="app-main">
        {currentScreen === 'upload' ? (
          <>
            <h2 className="upload-title">Загрузите вашу лекцию</h2>
            
            <UploadZone onFileSelect={(name) => setSelectedFile(name)} />
            
            <button 
              disabled={!selectedFile}
              onClick={() => setCurrentScreen('quiz')}
              className={`generate-btn ${
                selectedFile ? 'generate-btn-active' : 'generate-btn-disabled'
              }`}
            >
              Сгенерировать тест →
            </button>
          </>
        ) : (
          <div className="quiz-screen-container">
            <h2 className="quiz-main-title">Тест по лекции</h2>
            
            <QuizCard 
              question="Что такое React?" 
              options={[
                "Библиотека для UI", 
                "Язык программирования", 
                "База данных", 
                "Фреймворк для бэка"
              ]}
              onSelect={(opt) => console.log("Выбран ответ:", opt)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;