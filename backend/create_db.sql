CREATE SCHEMA IF NOT EXISTS quiz_maker;

CREATE TABLE IF NOT EXISTS quiz_maker.quiz
(
    id_quiz BIGSERIAL PRIMARY KEY,
    title TEXT DEFAULT 'No title',
    topic TEXT DEFAULT 'No topic',
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_maker.question
(
    id_question BIGSERIAL PRIMARY KEY,
    id_quiz BIGINT NOT NULL,
    text TEXT NOT NULL,
    type TEXT CHECK ((type = 'quiz') OR (type = 'flashcard')),
    correct_answer TEXT NOT NULL,
    CONSTRAINT fk_id_quiz FOREIGN KEY (id_quiz)
    REFERENCES quiz_maker.quiz(id_quiz)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_maker.option
(
    id_option BIGSERIAL PRIMARY KEY,
    id_question BIGINT NOT NULL,
    text TEXT NOT NULL,
    CONSTRAINT fk_id_question FOREIGN KEY (id_question)
    REFERENCES quiz_maker.question(id_question)
    ON DELETE CASCADE
)