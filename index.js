const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('The mystery maze shop server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qd7bbha.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();



    const allToysCollection = client.db('mysteryMaze').collection('allToys')
    const userToysCollection = client.db('mysteryMaze').collection('userToys')

    app.get('/alltoys', async (req, res) => {
      const result = await allToysCollection.find().toArray();
      res.send(result);
    })

    app.get('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.findOne(query);
      res.send(result);
    })

    // user toys
    app.post('/usertoys', async (req, res) => {
      const newToy = req.body;
      const result = await userToysCollection.insertOne(newToy);
      res.send(result)
    })

    app.get('/usertoys', async (req, res) => {
      const result = await userToysCollection.find().toArray();
      res.send(result)
    })

    app.delete('/usertoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userToysCollection.deleteOne(query);
      res.send(result)
    })

    // JWT
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      res.send({token})
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running in localhost:${port}`);
})