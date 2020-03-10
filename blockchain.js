const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        
        for (let i=1; i<chain.length; i++) {
            const { timestamp, lastHash, hash, data } = chain[i];

            // `lastHash` reference broke
            if (lastHash !== chain[i-1].hash) return false;

            const hashCalc = cryptoHash(timestamp, lastHash, data);
            // `data` corrupted; therefore, `hash` becomes invalid
            if (hash !== hashCalc) return false;
        }
        return true;
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;