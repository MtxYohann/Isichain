const Block = require('./block');
const { DIFFICULTY } = require('./config');

describe('Block', () => {
  it('mines a block with a hash that matches the difficulty', () => {
    const lastBlock = Block.genesis();
    const data = 'test-data';
    const minedBlock = Block.mineBlock(lastBlock, data);

    expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
    expect(minedBlock.data).toEqual(data);
    expect(minedBlock.lastHash).toEqual(lastBlock.hash);
  });

  it('lowers difficulty for a slower generated block', () => {
    const block = Block.mineBlock(Block.genesis(), 'test-data');
    expect(Block.adjustDifficulty(block, block.timestamp + 30000)).toEqual(block.difficulty - 1);
  });

  it('raises difficulty for a fast generated block', () => {
    const block = Block.mineBlock(Block.genesis(), 'test-data');
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
});