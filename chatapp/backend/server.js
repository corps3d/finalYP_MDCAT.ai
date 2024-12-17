const express = require("express");
const cors = require("cors");
require("./models/db.js");
const ChatRouter = require("./routes/chat.js")
const UserRouter = require("./routes/user.js")
const questionsRouter = require('./routes/questions');
const quizRouter = require("./routes/quiz.js");
const subjectRouter = require('./routes/subjects'); // Import the subjects routes
const importRouter = require('./routes/import')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/chat", ChatRouter)
app.use(UserRouter)
app.use("/quiz", quizRouter)
app.use('/mcqs',questionsRouter);
app.use('/subjects', subjectRouter); 
app.use('/api', importRouter); // Add the import route


// Routes
app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
