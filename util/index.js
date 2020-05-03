// ECC
const EC = require('elliptic').ec;

// Create and initialize EC context
const ec = new EC('secp256k1');

module.exports = { ec };