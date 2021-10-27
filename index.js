const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
/* 
    User: mydbuser1
    Password: cheprji57ZAug8nN
*/



const uri = "mongodb+srv://mydbuser1:cheprji57ZAug8nN@cluster0.vikxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("productsManagement");
        const productsCollection = database.collection("products");

        //GET API

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        //Post API
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result)
        });

        //load single 

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

        //Delete API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    image: updatedProduct.image,
                    des: updatedProduct.des
                }
            };
            const result = await productsCollection.updateOne(filter, updateProduct, options);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



const defaultResponse = `
<a href="/products">Products</a>
<h1 
style = "color: red; text-align: center;"
>
Welcome to the server of product management website
</h1>
`


app.get('/', (req, res) => {
    res.send(defaultResponse);
    
});

app.listen(port, () => {
    console.log("Listening server on port", port);
})
