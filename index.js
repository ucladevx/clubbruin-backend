const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// add this to .env
const PORT = process.env.PORT || 9000

const authRoutes = require("./routes/auth/auth")

app.use("/auth", authRoutes)

app.get('/health', (req, res) => {
    res.status(200).send({
        message: `Listening on Port ${PORT}`
    })
})

const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://superuser:clubbruin@cluster0.djc4y.mongodb.net/user?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to database')
    } catch (err) {
        console.log('Could not connect to database. Exiting...')
        process.exit(1)
    }
}

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

connectToDB()