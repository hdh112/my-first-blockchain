const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '---',
    hash: 'default-hash',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const INITIAL_BALANCE = 500;

module.exports = { GENESIS_DATA, MINE_RATE, INITIAL_BALANCE };