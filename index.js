const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

// GET request
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// POST request
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

const DEFAULT_PORT = 3000;
let PEER_PORT;

// cf) window.crypto.getRandomValues() for better safety
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil( Math.random()*1000 );
}

// Set up server (localhost)
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => console.log(`listening at localhost:${PORT}`));