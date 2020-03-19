// Test suite for test-driven development
const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain, newChain;

    // Renew `blockchain` instance before every test
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    // TODO: change the array into a more memory efficient data structure
    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    
    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the end of the chain and returns the new block', () => {
        const newData = 'test-data';
        const newBlock = blockchain.addBlock({ data: newData });

        // expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
        expect(newBlock.data).toEqual(newData);
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

    describe('replaceChain()', () => {
        let errorTxt, logTxt;

        beforeEach(() => {
            errorTxt = jest.fn();
            logTxt = jest.fn();

            global.console.error = errorTxt;
            global.console.log = logTxt;
        });

        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                // TODO:    which is the base case?
                //          test when blockchain has only genesis block?
                blockchain.addBlock({ data: 'block-data' });
                newChain.addBlock({ data: 'new-data' });

                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorTxt).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'block-data-1' });
                newChain.addBlock({ data: 'new-data-1' });
                newChain.addBlock({ data: 'new-data-2' });
                newChain.addBlock({ data: 'new-data-3' });
            });

            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[3] = { data: 'invalid-new-data' };

                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                }); 

                it('logs an error', () => {
                    expect(errorTxt).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                }); 

                it('logs that chain is replaced', () => {
                    expect(logTxt).toHaveBeenCalled();
                });
            });
        });
    });
});