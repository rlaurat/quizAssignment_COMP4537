const xhttp = new XMLHttpRequest();
const endPointRoot = "https://rachellaurat.com/quizAssignment/";
let resource = "";
let questionNumber = 1;
const url = new URL(window.location.href);
let quizID = url.searchParams.get('quiz');
const GET = "GET";
const PUT = "PUT";
const DELETE = "DELETE";
const POST = "POST";


function getQuestionsAdmin(){
    resource = "admin/quizzes/questions/" + quizID;
    xhttp.open(GET, endPointRoot + resource, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let questions = parseQuestionJSON(JSON.parse(this.responseText));
            if(questions.length !== 0) {
                document.getElementById("quiz-title").value = JSON.parse(this.responseText)[0].title;
                populateQuestionFields(questions);
            } else {
                createNewQuestionEntry();
            }
        }
    };
}

function parseQuestionJSON(questionJSON) {
    let questions = [];
    let counter = 0;
    let qText = "";
    for(let i = 0; i < questionJSON.length; i++) {
        let isCorrect = questionJSON[i].isCorrect.data[0];
        if(questionJSON[i].questionText != qText) {
            counter = 0;
            qText = questionJSON[i].questionText;
            if(questionJSON[i].isCorrect.data[0] === 1){
                correctIndex = 0;
            } else {
                correctIndex = "";
            }
            let answer = new Answer(questionJSON[i].answerID, questionJSON[i].answerText, isCorrect);
            questions.push(new Question(questionJSON[i].questionID, quizID, questionJSON[i].questionText, [answer], correctIndex));
        } else {
            questions[questions.length-1].answers.push(new Answer(questionJSON[i].answerID, questionJSON[i].answerText, isCorrect));
            if(isCorrect === 1){
                questions[questions.length-1].correctIndex = counter;
            }
        }
        counter = counter + 1;
    }
    return questions;
}

function populateQuestionFields(questionList) {
    let questionID = null;
    for(let i = 0; i < questionList.length; i++) {
        let parent = document.getElementById("page-wrap");
        questionID = questionList[i].id;
    
        let section = document.createElement("div");
        section.setAttribute("id", "div-question" + questionID);
    
        let title = document.createElement("h2");
        title.innerHTML = "Question " + questionNumber;
        questionNumber++;
        
        let question = document.createElement("textarea");
        question.rows = 5;
        question.id = "question" + questionID;
        question.className = "form-control";
        question.innerHTML = questionList[i].questionText;
    
        let answers = document.createElement("h3");
        answers.innerHTML = "Answers";
    
        section.appendChild(title);
        section.appendChild(question);
        section.appendChild(answers);
    
        createFilledAnswerInput(questionList[i].answers.length, section, questionList[i].answers, questionList[i].correctIndex, questionID);

        let alertMsg = document.createElement("p");
        alertMsg.id = "alert" + questionID;
        section.appendChild(alertMsg);
    
        createButton("Save Changes", saveChanges, "saveButton" + questionID, section, "btn-primary", false);
        createButton("Delete", deleteQuestion, "deleteButton" + questionID, section, "btn-danger", false);
    
        parent.append(section);
    }
}

function createFilledAnswerInput(numberOfLines, parent, answers, index, id) {
    for (let i=0; i < numberOfLines; i++) {
        let div1 = document.createElement("div");
        div1.className = "input-group mb-3";
        let div2 = document.createElement("div");
        div2.className = "input-group-prepend";
        div1.appendChild(div2);
        let div3 = document.createElement("div");
        div3.className = "input-group-text";
        div2.appendChild(div3);
        radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "radio" + id;
        radioBtn.value = i;
        radioBtn.id = "radio" + answers[i].id;
        if (i === index) {
            radioBtn.checked = true;
        }
        div3.appendChild(radioBtn);
        answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.className = "form-control answers" + id;
        answerInput.id = "answer"+ answers[i].id;
        if(answers[i] !== undefined){
            answerInput.value = answers[i].answerText;
        }
        div1.appendChild(answerInput);
        parent.append(div1);
    }
}

function createButton(label, onclickFunction, id, parent, type, disabled) {
    let newButton = document.createElement("button");
    newButton.innerHTML = label;
    newButton.onclick = onclickFunction;
    newButton.id = id;
    newButton.className = "btn " + type;
    newButton.disabled = disabled;
    parent.appendChild(newButton);
}

function createAnswerInput(numberOfLines, parent, questionID) {
    for (let i=0; i < numberOfLines; i++) {
        let div1 = document.createElement("div");
        div1.className = "input-group mb-3";
        let div2 = document.createElement("div");
        div2.className = "input-group-prepend";
        div1.appendChild(div2);
        let div3 = document.createElement("div");
        div3.className = "input-group-text";
        div2.appendChild(div3);
        radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "radio" + questionID;
        radioBtn.value = i;
        div3.appendChild(radioBtn);
        answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.className = "form-control answers" + questionID;
        div1.appendChild(answerInput);
        parent.append(div1);
    }
}

function createNewQuestionEntry() {
    let parent = document.getElementById("page-wrap");

    let section = document.createElement("div");
    section.setAttribute("id", "div-question" + "New");

    let title = document.createElement("h2");
    title.innerHTML = "Question " + questionNumber;
    let question = document.createElement("textarea");
    question.rows = 5;
    question.id = "question" + "New";
    question.className = "form-control";

    let answers = document.createElement("h3");
    answers.innerHTML = "Answers"

    section.appendChild(title);
    section.appendChild(question);
    section.appendChild(answers);

    createAnswerInput(4, section, "New");

    let alertMsg = document.createElement("p");
    alertMsg.id = "alertNew";
    section.appendChild(alertMsg);
    
    createButton("Save Changes", saveChanges, "saveButton" + "New", section, "btn-primary", true);
    createButton("Add to Database", addQuestion, "addButton" + "New", section, "btn-success", false);
    document.getElementById("new-question").disabled = true;

    parent.append(section);
}


function generateQuestionObject(qNum) {
    let answer_references = document.getElementsByClassName("answers" + qNum);
    let question_text = document.getElementById("question" + qNum).value;
    let radio = document.getElementsByName("radio" + qNum);
    let correctIndex = null;
    let correct = null;
    let answers = [];
    let answerID = null;
    let total_answers = 0;
    let alert = document.getElementById("alert" + qNum)
    for(i = 0; i < radio.length; i++) {
        if(radio[i].checked) {
            correctIndex = radio[i].value;
            correct = 1;
        } else {
            correct = 0;
        }
        let answerText = answer_references[i].value;
        if(qNum != "New") {
            answerID = parseInt(answer_references[i].id.match(/(\d+)/)[0]);
        }
        if (answer_references[i].value.trim() != "") {
            answers[i] = new Answer(answerID, answerText, correct);
            total_answers++;
        }
    }
    if (total_answers < 2) {
        alert.innerHTML = "At least 2 answers must be entered!";
        alert.style.color = "red";
        return null;
    }
    if (question_text.trim() === "") {
        alert.innerHTML = "Question must be entered!";
        alert.style.color = "red";
        return null;
    }
    if (correctIndex === null) {
        alert.innerHTML = "Correct answer must be selected!";
        alert.style.color = "red";
        return null;
    }
    return new Question(qNum, quizID, question_text, answers, correctIndex);
}

function addQuestion() {
    let newQuestion = generateQuestionObject("New");
    if (newQuestion === null) {
        return;
    }
    resource = "admin/quizzes/questions/"
    xhttp.open("POST", endPointRoot + resource, true);
    xhttp.send(JSON.stringify(newQuestion));
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            document.getElementById("addButtonNew").remove();
            document.getElementById("saveButtonNew").disabled = false;
            document.getElementById("new-question").disabled = false;
            questionNumber++;
            window.location.reload();
        }
    }

}

function saveQuizTitle() {
    let quizTitle = document.getElementById("quiz-title").value;
    resource = "admin/quizzes/title/" + quizID;
    xhttp.open("PUT", endPointRoot + resource, true);
    xhttp.send(quizTitle);
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
}


function deleteQuestion() {
    let questionID = this.id.match(/(\d+)/)[0];
    console.log("Deleting question...");
    resource = "admin/quizzes/questions/" + questionID;
    xhttp.open("DELETE", endPointRoot + resource, true);
    xhttp.send(questionID.toString());
    xhttp.onreadystatechange=function() {
        if(this.readyState==4 &&this.status == 200) {
            console.log(this.responseText);
            window.location.reload();
        }
    }
}

function saveChanges() {
    let questionID = this.id.match(/(\d+)/)[0];
    resource = "admin/quizzes/questions/" + questionID;
    let updatedQuestion = generateQuestionObject(questionID);
    if (updatedQuestion === null) {
        return;
    }
    let msg = document.getElementById("alert" + questionID);
    xhttp.open("PUT", endPointRoot + resource, true);
    xhttp.send(JSON.stringify(updatedQuestion));
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            msg.innerHTML = "Successfully updated question details.";
            msg.style.color = "green";
        }
    }
}

getQuestionsAdmin();
