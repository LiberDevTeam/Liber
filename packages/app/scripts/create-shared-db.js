require('dotenv').config();

const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

IPFS.create({ repo: process.env.IPFS_REPO }).then(async (ipfs) => {
  const orbitdb = await OrbitDB.createInstance(ipfs, {
    directory: process.env.ORBITDB_DIRECTORY,
    identity: JSON.parse(process.env.ORBITDB_IDENTITY),
    AccessControllers,
  });

  const address = 'feeds';
  const db = await orbitdb.feed(address, {
    // TODO restricts users from updating other user's records.
    accessController: {
      type: 'record-based',
    },
  });

  console.log(address, db.address);

  [
    'explore/places',
    'explore/messages',
    'marketplace/bots/new',
    'marketplace/stickers/new',
  ].forEach(async (address) => {
    const db = await orbitdb.keyvalue(address, {
      // TODO restricts users from updating other user's records.
      accessController: {
        type: 'record-based',
      },
    });
    console.log(address, db.address);
  });

  ['marketplace/bots/ranking', 'marketplace/stickers/ranking'].forEach(
    async (address) => {
      const db = await orbitdb.keyvalue(address, {
        accessController: {
          type: 'record-based',
        },
      });
      console.log(address, db.address);
    }
  );
});
