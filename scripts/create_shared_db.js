require('dotenv').config();

const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

IPFS.create({ repo: process.env.IPFS_REPO }).then(async (ipfs) => {
  const orbitdb = await OrbitDB.createInstance(ipfs, {
    directory: process.env.ORBITDB_DIRECTORY,
    identity: JSON.parse(process.env.ORBITDB_IDENTITY),
  });

  const address = 'feeds';
  const db = await orbitdb.keyvalue(address);

  console.log(address, db.address);

  [
    'places/search',
    'messages/search',
    'bots/marketplace',
    'stickers/marketplace',
  ].forEach(async (address) => {
    const db = await orbitdb.keyvalue(address);
    console.log(address, db.address);
  });
});
