# Загрузить репозиторий и начать работу
git clone https://github.com/Xanton9one/quiz-maker-practice.git

# Установить нейронку локально (Windows)
irm https://ollama.com/install.ps1 | iex

# Установить нейронку локально (MacOS / Linux)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:7b

# После установки: >>> The Ollama API is now available at 127.0.0.1:11434.

# Проверка работы
ollama run qwen2.5:7b "Привет, скажи 'работает'"