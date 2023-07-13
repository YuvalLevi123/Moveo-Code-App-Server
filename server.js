require("dotenv").config();
const uri = process.env.MONGODB_URI;
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const db = require("./config/db.config");
const CodeBlock = require("./models/codeBlock.model");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
io.on("connection", (socket) => {
  socket.on("codeUpdate", (data) => {
    CodeBlock.findOneAndUpdate(
      { id: data.id },
      { code: data.code },
      { new: true }
    )
      .then((updatedCodeBlock) => {
        if (!updatedCodeBlock) {
          return console.log("Code block not found");
        }
        socket.broadcast.emit("codeUpdate", updatedCodeBlock);
      })
      .catch((error) => {
        console.error("Error updating code block:", error);
      });
  });

  socket.on("disconnect", () => {});
});

app.get("/api/codeblocks", (req, res) => {
  CodeBlock.find()
    .then((codeBlocks) => {
      res.json(codeBlocks);
    })
    .catch((error) => {
      console.error("Error fetching code blocks:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/api/codeblocks/:id", (req, res) => {
  const { id } = req.params;
  CodeBlock.findOne({ id: id })
    .then((codeBlock) => {
      if (!codeBlock) {
        return res.status(404).json({ error: "Code block not found" });
      }
      res.json(codeBlock);
    })
    .catch((error) => {
      console.error("Error fetching code block:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.put("/api/codeblocks/:id", (req, res) => {
  const { id } = req.params;
  const { currentVisitors } = req.body;
  CodeBlock.findOneAndUpdate({ id: id }, { currentVisitors: currentVisitors })
    .then((updatedCodeBlock) => {
      io.emit("codeUpdate", updatedCodeBlock);
      res.json(updatedCodeBlock);
    })
    .catch((error) => {
      console.error("Error updating code block:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.put("/api/reset", (req, res) => {
  const updatePromises = [];
  for (let i = 1; i < 5; i++) {
    const updatePromise = CodeBlock.updateOne(
      { id: parseInt(i) },
      {
        currentVisitors: 0,
        code: codeBlocksDefault[i - 1].code,
        solution: codeBlocksDefault[i - 1].solution,
      }
    );
    updatePromises.push(updatePromise);
  }
  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: "Reset Done" });
    })
    .catch((error) => {
      console.error("Error resetting code blocks:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

let codeBlocksDefault = [
  {
    id: "1",
    title: "Arrow Function",
    code: `let age = prompt("What is your age?", 18);

    let welcome = (age < 18) ?
      () => alert('Hello!') :
      () => alert("Greetings!");
    
    welcome();`,
    solution: `let age = prompt("What is your age?", 18);

    let welcome = (age < 18) ?
      () => alert('Hello!') :
      () => alert("Greetings!");
    
    welcome(solution);`,
  },
  {
    id: "2",
    title: "Async/await",
    code: `async function f() {

      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000)
      });
    
      let result = await promise; // wait until the promise resolves (*)
    
      alert(result); 
    }
    
    f();`,
    solution: `async function f() {

      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000)
      });
    
      let result = await promise; // wait until the promise resolves (*)
    
      alert(result); 
    }
    
    f(solution);`,
  },
  {
    id: "3",
    title: "Objects",
    code: `let user = {     // an object
      name: "John",  // by key "name" store value "John"
      age: 30        // by key "age" store value 30
    };`,
    solution: `let user = {     // an object
      name: "John",  // by key "name" store value "John"
      age: 30        // by key "age" store value 30
    }; (solution)`,
  },
  {
    id: "4",
    title: "Array methods",
    code: `let users = [
      {id: 1, name: "John"},
      {id: 2, name: "Pete"},
      {id: 3, name: "Mary"}
    ];
    
    let user = users.find(item => item.id == 1);
    
    alert(user.name);`,
    solution: `let users = [
      {id: 1, name: "John"},
      {id: 2, name: "Pete"},
      {id: 3, name: "Mary"}
    ];
    
    let user = users.find(item => item.id == 1);
    
    alert(solution);`,
  },
];
