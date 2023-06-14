//app.js
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://vinicostaz:5a6JQ2lLeJLCYIQN@cluster0.5dvj19f.mongodb.net/");
  if(!conn) return new Error("Can't connect");
    global.db = await conn.db("unifor");
  return global.db;
}

const express = require('express');
const app = express();         
const port = 3000; //porta padrão

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// GET dog
router.get('/dog', async function(req, res, next) {
  try{
    const apidog = await fetch('https://dog.ceo/api/breed/hound/list');
    res.json(await apidog.json());
  }
  catch(ex){
    console.log(ex);
    res.status(400).json({erro: `${ex}`});
  }
}) 

/* GET produto */
router.get('/produto/:id?', async function(req, res, next) {
    try{
      const db = await connect();
      if(req.params.id)
        res.json(await db.collection("produto").findOne({_id: new ObjectId(req.params.id)}));
      else
        res.json(await db.collection("produto").find().toArray());
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// POST /produto
router.post('/produto', async function(req, res, next){
    try{
      const produto = req.body;
      const db = await connect();
      res.json(await db.collection("produto").insertOne(produto));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// PUT /produto/{id}
router.put('/produto/:id', async function(req, res, next){
    try{
      const produto = req.body;
      const db = await connect();
      res.json(await db.collection("produto").updateOne({_id: new ObjectId(req.params.id)}, {$set: produto}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// DELETE /produto/{id}
router.delete('/produto/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection("produto").deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');