const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGO_URI);

const dbPromise = client.connect().then(() => {
    console.log("MongoDB connected");
    return client.db("db_455kbfnaj");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/members", async (req, res) => {
    try {
        const db = await dbPromise;

        await db.collection("clubMembers").insertOne(req.body);

        console.log("Data saved:", req.body);

        res.send("Club Member Registered Successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Registration Failed!");
    }
});

app.get("/show", async (req, res) => {
    try {
        const db = await dbPromise;

        const data = await db.collection("clubMembers").find({}).toArray();

        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to fetch data");
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(3010, () => {
        console.log("Server running on port 3010");
    });
}