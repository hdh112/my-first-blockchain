const { INITIAL_BALANCE } = require('../config');
const { ec } = require('../util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;

        const keyPair = ec.genKeyPair();
        this.publicKey = keyPair.getPublic().encode('hex');
        
    }

}

module.exports = Wallet;