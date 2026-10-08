const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("db_455kbfnaj");
    console.log("MongoDB connected");
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/members", async (req, res) => {
    try {
        await db.collection("clubMembers").insertOne(req.body);

        console.log("Data saved:", req.body);

        res.send("Club Member Registered Successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Registration Failed!");
    }
});

app.get("/show", async (req, res) => {
    const data = await db.collection("clubMembers").find({}).toArray();
    res.json(data);
});

connectDB();

app.listen(3010, () => {
    console.log("Server running on port 3010");
});