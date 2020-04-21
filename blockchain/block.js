const hex2bin = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

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
        let timestamp, hash;
        let nonce = 0;
        let { difficulty } = lastBlock;
        
        do {
            timestamp = Date.now();
            nonce++;
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (!hex2bin(hash).startsWith('0'.repeat(difficulty)));

        return new this({ timestamp, lastHash, data, hash, nonce, difficulty });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;
        
        if (timestamp - originalBlock.timestamp < MINE_RATE)
            return difficulty + 1;
        else {
            return difficulty - 1;
        }
    }
}

module.exports = Block;