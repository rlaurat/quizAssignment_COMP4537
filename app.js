let http = require('http');
let mysql = require('mysql');
let urlParser = require('url');
const GET = 'GET';
const PUT = 'PUT';
const OPTIONS = 'OPTIONS';
const POST = 'POST';
const DELETE = 'DELETE';
const endPointRoot = '/quizAssignment';

const db = mysql.createConnection({
    host: "localhost",
    user: "*****",
    password: "*****",
    database: "*****"
});

http.createServer(function(req, res) {
    const headers = {
    'Content-type': 'text/plain',
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    };
    console.log("Received request");
    res.writeHead(200, headers);

    let url = urlParser.parse(req.url, true);
    console.log("REQUEST URL: " + req.url);
    console.log("REQUEST METHOD: " + req.method);
    //get all quizzes
    if (req.method === GET && (req.url === endPointRoot + '/student/quizzes' || req.url === endPointRoot + '/admin/quizzes')) {
        console.log("connected to db");
        let sql = "SELECT * FROM quiz ORDER BY id;";
        db.query(sql, function(err, result) {
            if (err) throw err;
            let sqlResult = JSON.stringify(result);
            console.log("RESULT");
            console.log(result);
            res.end(sqlResult);
        });
        return;
    }

    //get all questions from a single quiz
    if (req.method === GET && (req.url.indexOf('/student/quizzes/questions/') >= 0 || req.url.indexOf('/admin/quizzes/questions/') >= 0)) {
        console.log("connected to db");
        let id = req.url.match(/(\d+)/)[0];
        let sql = "SELECT answer.id AS 'answerID', question.id AS 'questionID', quiz.id as 'quizID', questionText, answerText, isCorrect, title FROM question RIGHT JOIN answer ON question.id=answer.questionID JOIN quiz ON question.quizID=quiz.id WHERE quizID=" + id + " ORDER BY questionID, answerID;";
        db.query(sql, function(err, result) {
            if (err) throw err;
            sqlResult = JSON.stringify(result);
            sql = "SELECT title FROM quiz WHERE id=" + id + ';';
            res.end(sqlResult);
        });
    }

    //update quiz title
    if ((req.method === PUT || req.method === OPTIONS) && req.url.indexOf('/admin/quizzes/title/') >= 0) {
        let body = "";
        req.on('data', function(chunk) {
            if(chunk !== null) {
                let splitURL = req.url.split('/');
                let quizID = splitURL[splitURL.length-1];
                let sql = "UPDATE quiz SET title='" + chunk + "' WHERE id=" + quizID + ';';
                db.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("updated title to: " + chunk);
                });
            }
        });
        req.on('end', function() {
            res.end(body);
        });
    }

    // create new quiz
    if (req.method === POST && req.url === endPointRoot + '/admin/quizzes') {
        console.log("creating quiz");
        let body = "";
        req.on('data', function(chunk) {
            if(chunk !== null) {
                let sql = "INSERT INTO quiz (title) VALUES (NULL);";
                db.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("created new quiz in database");
                    console.log("RESPONSE FROM POST: ", result.insertId);
                    res.end(result.insertId.toString());
                });
            }
        });
    }

    // add question to quiz
    if (req.method === POST && req.url === endPointRoot + '/admin/quizzes/questions/') {
        console.log("adding question");
        let body = "";
        req.on('data', function(chunk) {
            if(chunk !== null) {
                let newQuestion = JSON.parse(chunk);
                let newAnswers = newQuestion.answers;
                let sql = "INSERT INTO question (questionText, quizID) VALUES('" + newQuestion.questionText + "', " + newQuestion.quizID + ");";
                db.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log(result.insertId);
                    for(i=0; i < newAnswers.length; i++) {
                        sql = "INSERT INTO answer (answerText, questionID, isCorrect) VALUES('" + newAnswers[i].answerText + "'," + result.insertId + ", " + newAnswers[i].isCorrect + ");";
                        db.query(sql, function(err, result) {
                            if(err) throw err;
                            console.log(result.insertId);
                        });
                    }
                });
            }
        });
        req.on('end', function() {
            res.end(body);
        });
    }

    // update existing question
    if ((req.method === OPTIONS || req.method === PUT) && req.url.indexOf('/admin/quizzes/questions/')>=0) {
        let body="";
        req.on('data', function(chunk) {
            if(chunk !== null) {
                console.log(chunk);
                let updatedQuestion = JSON.parse(chunk);
                let updatedAnswers = updatedQuestion.answers;
                let sql = "UPDATE question SET questionText='"+ updatedQuestion.questionText + "' WHERE id=" + updatedQuestion.id + ";";
                db.query(sql, function(err, result) {
                    if(err) throw err;
                    console.log("updated question text to: " + updatedQuestion.questionText);
                });
                for(i=0; i < updatedAnswers.length; i++) {
                    console.log(updatedAnswers[i].id);
                    sql2 = "UPDATE answer SET answerText='" + updatedAnswers[i].answerText + "', isCorrect=" + updatedAnswers[i].isCorrect + " WHERE id=" + updatedAnswers[i].id + ';';
                    console.log("answer id: " + updatedAnswers[i].id);
                    console.log("updating answer to: " + updatedAnswers[i].answerText);
                    console.log("updating correctness: " + updatedAnswers[i].isCorrect);
                    db.query(sql2, function(err, result) {
                        if(err) throw err;
                    });
                }
                
            }
        });
        
        req.on('end', function() {
            res.end(body);
        });
    }
    
     if (req.method === DELETE && req.url.indexOf('/admin/quizzes/questions/')>=0) {
         let body = "";
         req.on('data', function(chunk) {
             if (chunk!== null) {
                 console.log(chunk);
                 let sql = "DELETE FROM answer WHERE questionID=" + chunk + ';';
                 db.query(sql, function(err, result) {
                     if (err) throw err;
                     console.log("Deleted answers");
                 });
                 let sql2 = "DELETE FROM question WHERE id=" + chunk + ';';
                 db.query(sql2, function(err, result) {
                     if (err) throw err;
                     console.log("Deleted question");
                 });
             }
         });
        req.on('end', function() {
            res.end(body);
        });
     }
}).listen();
console.log('listening');