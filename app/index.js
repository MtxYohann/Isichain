const express = require('express');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p-server');

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

app.use(express.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required to mine a block.' });
  }

  const newBlock = blockchain.addBlock(data);
  console.log(`New block added: ${JSON.stringify(newBlock)}`);

  p2pServer.syncChain();

  res.json({
    message: 'New block mined successfully',
    block: newBlock,
  });
});

app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on port ${HTTP_PORT}`);
});

p2pServer.listen(P2P_PORT);

p2pServer.connectToPeers(peers);