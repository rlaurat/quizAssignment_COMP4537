class Question {
    constructor(id, quizID, questionText, answers, correctIndex) {
        this.id = id;
        this.quizID = quizID;
        this.questionText = questionText;
        this.answers = answers;
        this.correctIndex = correctIndex;
    }
}

class Answer {
    constructor(id, answerText, isCorrect) {
        this.id = id;
        this.answerText = answerText;
        this.isCorrect = isCorrect;
    }
}

class Quiz {
    constructor(id, title, questions) {
        this.id = id;
        this.title = title;
        this.questions = questions;
    }
}