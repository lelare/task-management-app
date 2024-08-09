const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [
    { id: "1", title: "Task 1", location: "Estonia", date: "2024-08-08", completed: false },
    { id: "2", title: "Task 2", location: "Estonia", date: "2024-08-09", completed: false },
    { id: "3", title: "Task 3", location: "Estonia", date: "2024-08-08", completed: false },
    { id: "4", title: "Task 4", location: "Estonia", date: "2024-08-10", completed: false },
    { id: "5", title: "Task 5", location: "Estonia", date: "2024-08-20", completed: false },
];

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    const newTask = { id: String(tasks.length + 1), ...req.body, location: "Estonia", completed: false };
    tasks.push(newTask);
    res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    tasks = tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task));
    res.json(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);

    if (tasks.length < initialLength) {
        res.sendStatus(204); // No Content, deletion successful
    } else {
        res.status(404).json({ error: "Task not found" }); // Task not found
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
