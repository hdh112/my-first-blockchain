const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

const initialBlock = blockchain.addBlock({ data: 'initial-data' });
console.log(`Initial hash: ${initialBlock.hash}`);

let prevTimestamp, nextTimestamp, timeDiff, average;

// Set initial values
const timeDiffs = [];
prevTimestamp = initialBlock.timestamp;

for(let i=0; i<10000; i++) {
    const { timestamp: nextTimestamp, difficulty } = blockchain.addBlock({ data: `test-data ${i}` });

    timeDiff = nextTimestamp - prevTimestamp;
    timeDiffs.push(timeDiff);

    // Update average time to mine block
    average = timeDiffs.reduce((total, time) => total + time) / timeDiffs.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${difficulty}. Average time: ${average}ms.`);

    // Modify previous value before continuing to next loop
    prevTimestamp = nextTimestamp;
}