const xhttp = new XMLHttpRequest();
const endPointRoot = "https://rachellaurat.com/quizAssignment/";
const assignmentRoot = "https://www.rachellaurat.com/COMP4537/isaAssignment/";
let resource = "";
const GET = "GET";

function generateQuizListAdmin(quizJSON) {
    parent = document.getElementById("quiz-list");
    for(i=0; i < quizJSON.length; i++) {
        let newQuizLink = document.createElement("a");
        newQuizLink.className = "list-group-item list-group-item-action";
        newQuizLink.innerHTML = quizJSON[i].title;
        newQuizLink.id = quizJSON[i].id;
        newQuizLink.href = "admin.html?quiz=" + quizJSON[i].id;
        parent.appendChild(newQuizLink);
    }
}
        
function getQuizzesAdmin() {
    resource = "admin/quizzes";
    xhttp.open(GET, endPointRoot + resource, true);
    //xhttp.setRequestHeader("content-type", "application/x-222-form-urlencoded");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            generateQuizListAdmin(JSON.parse(this.responseText));
        }
    };
}

function createQuizAdmin() {
    resource = "admin/quizzes";
    xhttp.open("POST", endPointRoot + resource, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("create quiz");
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log("RESPONSE TEXT: ", this.responseText);
            window.location.href = assignmentRoot + "admin.html?quiz=" + this.responseText;
        }
    };
}

getQuizzesAdmin();