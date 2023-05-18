const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res => {
    res.send('the mystery maze shop server is running')
}))



app.listen(port, () => {
    console.log(`server is running in localhost:${port}`);
})