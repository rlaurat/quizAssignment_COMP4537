const quiz = document.getElementById("quiz");
let questionCount = 0;
const xhttp = new XMLHttpRequest();
const endPointRoot = "https://rachellaurat.com/quizAssignment/";
let resource = "";
let questions = [];
const url = new URL(window.location.href);
const quizID = url.searchParams.get('quiz');
const GET = "GET";
const noQuestionsMsg = "Admin has not added any questions to this quiz yet!";


function getQuestionsStudent(){
    let questions = [];
    const url = new URL(window.location.href);
    let quizID = url.searchParams.get('quiz');
    console.log("QUIZ ID: " + quizID);
    resource = "student/quizzes/questions/" + quizID;
    xhttp.open(GET, endPointRoot + resource, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            questions = parseQuestionJSON(JSON.parse(this.responseText));
            if (questions.length === 0) {
                document.getElementById("student-quiz-title").innerHTML = noQuestionMsg;
            } else{
                document.getElementById("student-quiz-title").innerHTML = JSON.parse(this.responseText)[0].title;
            }
            generateQuiz(questions);
            getQuestions(questions);
        }
    };
}

function parseQuestionJSON(questionJSON) {
    let questions = [];
    let counter = 0;
    let qText = "";
    for(let i = 0; i < questionJSON.length; i++) {
        if(questionJSON[i].questionText != qText) {
            counter = 0;
            qText = questionJSON[i].questionText;
            if(questionJSON[i].isCorrect.data[0] === 1){
                correctIndex = 0;
            } else {
                correctIndex = "";
            }
            questions.push(new Question(questionJSON[i].id, quizID, questionJSON[i].questionText, [questionJSON[i].answerText], correctIndex));
        } else {
            questions[questions.length-1].answers.push(questionJSON[i].answerText);
            if(questionJSON[i].isCorrect.data[0] === 1){
                questions[questions.length-1].correctIndex = counter;
            }
        }
        counter = counter + 1;
    }
    return questions;
}

function getQuestions(data) {
    questions = data;
}

function generateQuestion(name, questionObj) {
    const div = document.createElement("div");
    div.classList.add("form-check");
    const question = document.createElement("h5");
    question.innerHTML = (name) + ". " + questionObj.questionText;
    div.appendChild(question);

    for (let i = 0; i < questionObj.answers.length; i++) {
        const id = name + "-" + i;
        
        const input = document.createElement("input");
        input.classList.add("form-check-input");
        input.type = "radio";
        input.id = id;
        input.name = name;
        input.value = i;
        
        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.htmlFor = id;
        label.innerHTML = questionObj.answers[i];
        
        const lineBreak = document.createElement("br");
        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(lineBreak);
    }

    return div;
}

function generateQuiz(questionsDict) { 
    for (let i = 0; i <= questionsDict.length-1; i++) {
        const question = generateQuestion(i + 1, questionsDict[i]);
        const lineBreak = document.createElement("br");

        quiz.appendChild(question);
        quiz.appendChild(lineBreak);
    }
    if (questionsDict.length === 0) {
        document.getElementById("submit").style.display = "none";
    } else {
        document.getElementById("submit").style.display = "inline";
    }
}

function checkAnswers() {
    let totalCorrect = 0;
    for (i=1; i <= questions.length; i++) {
        let radios = document.getElementsByName(i.toString());
        for (j = 0; j < radios.length; j++) {
            if (radios[j].checked && (questions[i-1].correctIndex == j)){
                totalCorrect++;
            }
        }
    }
    alert("Your score is: " + totalCorrect + '/' + questions.length);
}

getQuestionsStudent();
