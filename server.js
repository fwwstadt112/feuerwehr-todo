const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fwwstadt112:112112112@cluster0tasks.lq8k0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0tasks";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Todo Schema erstellen
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Aufgaben holen
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Aufgabe hinzufügen
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const newTodo = new Todo({ task, completed: false });
  await newTodo.save();
  res.json(newTodo);
});

// Aufgabe als erledigt markieren
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Aufgabe löschen
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
