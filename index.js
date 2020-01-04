const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const fs = require("fs");
const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

app.post("/content", (req, res) => {
    const contentList = readJSONFile();
    const newcontent = req.body;
    newcontent.id = uuidv1();
    contentList.push(newcontent);
    writeJSONFile(contentList);
    res.json(newcontent);
});
app.post("/users", (req, res) => {
    const userList = readUsers();
    const newUser = req.body;
    newUser.id = uuidv1();
    userList.push(newUser);
    writeUsers(userList);
    res.json(newUser);
});
app.get("/content/:id", (req, res) => {
    const contentList = readJSONFile();
    const id = req.params.id;
    let flag = false;
    let content;

    contentList.forEach(currentcontent => {
        if (id == currentcontent.id) {
            flag = true;
            content = currentcontent;
        }
    });

    if (flag) {
        res.json(content);
    } else {
        res.status(404).send('content ${id} was not found');
    }
});
app.get("/content", (req, res) => {
    const contentList = readJSONFile();
    res.json(contentList);
});

app.get("/users", (req, res) => {
    const userList = readUsers();
    res.json(userList);
});
app.put("/content/:id", (req, res) => {
    const contentList = readJSONFile();
    const id = req.params.id;
    const newcontent = req.body;

    newcontent.id = id;
    let flag = false;

    const newcontentList = contentList.map((content) => {
        if (content.id == id) {
            flag = true;
            return newcontent;
        }
        return content;
    });

    writeJSONFile(newcontentList);

    if (flag == true) {
        res.json(newcontent);
    } else {
        res.status(404).send('content ${id} was not found');
    }
});

app.delete("/content/:id", (req, res) => {
    const contentList = readJSONFile();
    const id = req.params.id;
    const newcontentList = contentList.filter((content) => content.id != id);

    if (contentList.length !== newcontentList.length) {
        res.status(200).send('post ${id} was removed');
        writeJSONFile(newcontentList);
    } else {
        res.status(404).send('post ${id} was not found');
    }
});

function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["content"];
}

function readUsers() {
    return JSON.parse(fs.readFileSync("users.json"))["users"];
}

function writeJSONFile(x) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({content: x}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}
function writeUsers(x) {
    fs.writeFileSync(
        "users.json",
        JSON.stringify({users: x}),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}
app.listen("3000", () =>
    console.log("Server started at: http://localhost:3000")
);