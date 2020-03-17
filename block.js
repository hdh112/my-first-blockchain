const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    // Curly bracing to a map decrease burden of ordering arguments
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        const { difficulty } = lastBlock;

        let nonce = 0;
        let timestamp = Date.now();
        let hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        
        while (!hash.startsWith('0'.repeat(difficulty))) {
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        }

        return new this({ timestamp, lastHash, data, hash, nonce, difficulty });
    }
}

module.exports = Block;