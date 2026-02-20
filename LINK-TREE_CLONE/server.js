const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

const filePath = path.join(__dirname, "data.json");


function readData() {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}


function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


app.get("/", (req, res) => {
    res.render("index");
});


app.post("/create", (req, res) => {
    const users = readData();

    const {
        username,
        name,
        email,
        linkedin,
        instagram,
        github,
        youtube
    } = req.body;

    
    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.send("Username already exists!");
    }

    const newUser = {
        username,
        name,
        email,
        linkedin,
        instagram,
        github,
        youtube
    };

    users.push(newUser);
    writeData(users);

    res.send("Profile Created Successfully!");
});


app.get("/search", (req, res) => {
    const users = readData();
    const  username  = req.query.username;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.render("notfound");
    }

    res.render("profile", { user });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});