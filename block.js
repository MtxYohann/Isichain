const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('./config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty; 
  }

  toString() {
    return `Block -
    Timestamp : ${this.timestamp}
    Last Hash : ${this.lastHash.substring(0, 10)}...
    Hash      : ${this.hash.substring(0, 10)}...
    Data      : ${this.data}
    Nonce     : ${this.nonce}
    Difficulty: ${this.difficulty}`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'genesis-hash', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let hash;
    let timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.blockHash({ timestamp, lastHash, data, nonce, difficulty });
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static blockHash({ timestamp, lastHash, data, nonce, difficulty }) {
    return SHA256(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`).toString();
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    if (difficulty < 1) return 1; 
    if (currentTime - lastBlock.timestamp > MINE_RATE) {
      return difficulty - 1; 
    }
    return difficulty + 1;
  }
}

module.exports = Block;