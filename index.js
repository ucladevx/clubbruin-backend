const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// add this to .env
const PORT = process.env.PORT || 9000

app.get('/health', (req, res) => {
    res.status(200).send({
        message: `Listening on Port ${PORT}`
    })
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})
