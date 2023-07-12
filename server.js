require("dotenv").config();
//const uri =
// "mongodb+srv://yuval:levi@cluster0.spf7mxz.mongodb.net/?retryWrites=true&w=majority";
const uri = process.env.MONGODB_URI;
const express = require("express");
const http = require("http");
const cors = require("cors");
// Import socket.io with a connection to a http server
const { Server } = require("socket.io");
const db = require("./config/db.config");
const CodeBlock = require("./models/codeBlock.model");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors());
app.use(express.json());

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
console.log("port:" + port);
console.log("uri" + uri);
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

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

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

// GET /api/codeblocks
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

// GET /api/codeblocks/:id
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

// PUT /api/codeblocks/:id
app.put("/api/codeblocks/:id", (req, res) => {
  const { id } = req.params;
  const { currentVisitors } = req.body;
  console.log(req.body);
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
      { currentVisitors: 0, code: codeBlocksDefault[i - 1].code }
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

// const codeBlockSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   code: {
//     type: String,
//     required: true,
//   },
//   id: {
//     type: String,
//     required: true,
//   },
//   currentVisitors: {
//     type: Number,
//     required: true,
//   },
// });

//const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);

let codeBlocksDefault = [
  {
    id: "1",
    title: "Arrow Function",
    code: `let age = prompt("What is your age?", 18);

    let welcome = (age < 18) ?
      () => alert('Hello!') :
      () => alert("Greetings!");
    
    welcome();`,
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
  },
  {
    id: "3",
    title: "Objects",
    code: `let user = {     // an object
      name: "John",  // by key "name" store value "John"
      age: 30        // by key "age" store value 30
    };`,
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
  },
];
