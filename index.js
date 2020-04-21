const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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

// Sync among multiple blockchains
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode===200) {
            const rootChain = JSON.parse(body);

            console.log(`Syncing with root blockchain:`, rootChain);
            blockchain.replaceChain(rootChain);
        };
    });
};

let PEER_PORT;

// cf) window.crypto.getRandomValues() for better safety
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil( Math.random()*1000 );
}

// Bind app to server (localhost)
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    // Sync to root only when created app is peer
    if (PORT !== DEFAULT_PORT) {
        syncChains(PORT);
    }
});