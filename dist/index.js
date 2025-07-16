const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🟢  MongoDB connected"))
  .catch((err) => {
    console.error("🔴  MongoDB connection error:", err.message);
    process.exit(1); // exit if DB fails
  });


const app = express();

app.use(cors());
app.use(express.json());



const {Schema, model} = require("mongoose");

const QuizSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
    },
    answers: {
        type: [String],
        required: true,
        unique: false
    },
    correctAnswer: {
        type: Number,
        required: true,
        unique: false
    }
});


const quizModel = model("quizModel", QuizSchema);


app.post("/submit" , async (req, res)  => {
    console.log("made it here");
    console.log(req.body);
    const {question, answers, correctAnswer} = req.body;
    console.log(question);
    console.log(answers);
    console.log(correctAnswer);


    const quizSaved = await quizModel.create(req.body);
    quizSaved.save();
    console.log(quizSaved);
    res.status(200).json("quizSaved")
});



//make a function to grab 10 random questions
app.get("/getquestions" , async (req, res)  => {
    console.log("made it getQuestions");
    


    const randomTen = await quizModel.aggregate([{ $sample: { size: 5 } }]);
    console.log(randomTen);

    res.status(200).json(randomTen);
});




app.get("/", (req, res) => {
    console.log("health check!!!");
    console.log(`this server is running on ${PORT}`)
    res.json("This brainrot website is live!!!!!!!!")

})


app.listen(PORT, () => {
    console.log("server is listening on port ", PORT)
})








