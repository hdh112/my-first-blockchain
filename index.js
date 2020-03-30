const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

// GET request
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// POST request
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

// Set up server (localhost)
const PORT = 3000;
app.listen(PORT, () => console.log(`listening at localhost:${PORT}`));