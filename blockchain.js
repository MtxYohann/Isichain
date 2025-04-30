const Block = require('./block');
class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    }

     addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = Block.mineBlock(lastBlock, data);
        this.chain.push(newBlock);
        return newBlock;
    }

    static blockHash(block){
            return block.hash;
    }
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    
        for (let i = 1; i < chain.length; i++) {
          const block = chain[i];
          const lastBlock = chain[i - 1];
    
          const recalculatedHash = Block.blockHash({
            timestamp: block.timestamp,
            lastHash: block.lastHash,
            data: block.data,
            nonce: block.nonce,
            difficulty: block.difficulty, 
          });
    
          if (
            block.lastHash !== lastBlock.hash || 
            block.hash !== recalculatedHash || 
            Math.abs(block.difficulty - lastBlock.difficulty) > 1 
          ) {
            return false;
          }
        }
    
        return true;
      }
    
    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.error('Received chain is not longer than the current chain.');
            return;
        } else if (!Blockchain.isValidChain(newChain)) {
            console.error('Received chain is not valid.');
            return;
        }
    
        console.log('Replacing blockchain with the new chain.');
        this.chain = newChain;
    }
}
    module.exports = Blockchain;