// Test suite for test-driven development
const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./crypto-hash');

describe('Blockchain', () => {
    let blockchain = new Blockchain();

    // Renew `blockchain` instance before every test
    beforeEach(() => {
        blockchain = new Blockchain();
    });

    // TODO: change the array into a more memory efficient data structure
    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    
    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the end of the chain', () => {
        const newData = 'test-data';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            // Set `blockchain` to a chain of multiple blocks
            beforeEach(() => {
                blockchain.addBlock({ data: 'added-data-1' });
                blockchain.addBlock({ data: 'added-data-2' });
                blockchain.addBlock({ data: 'added-data-3' });
            });


            describe('and a `lastHash` reference has changed', () => {
                it('returns false', () => {
                    // Break chain reference
                    blockchain.chain[2].lastHash = blockchain.chain[0].hash;
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    // Invalidate data
                    blockchain.chain[2].data = 'invalid-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
                
            });
            
            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});