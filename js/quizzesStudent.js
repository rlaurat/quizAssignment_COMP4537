const xhttp = new XMLHttpRequest();
const endPointRoot = "https://rachellaurat.com/quizAssignment/";
let resource = "";
const GET = "GET";
const noQuizMsg = "Admin has not created any quizzes yet!";

function generateQuizListStudent(quizJSON) {
    parent = document.getElementById("quiz-list");
    if (quizJSON.length === 0) {
        parent.innerHTML = NoQuizMsg;
    }
    for(i=0; i < quizJSON.length; i++) {
        let newQuizLink = document.createElement("a");
        newQuizLink.className = "list-group-item list-group-item-action";
        newQuizLink.innerHTML = quizJSON[i].title;
        newQuizLink.id = quizJSON[i].id;
        newQuizLink.href = "student.html?quiz=" + quizJSON[i].id;
        parent.appendChild(newQuizLink);
    }
}
        
function getQuizzesStudent() {
    resource = "student/quizzes";
    xhttp.open(GET, endPointRoot + resource, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            generateQuizListStudent(JSON.parse(this.responseText));
        }
    };
}

getQuizzesStudent();