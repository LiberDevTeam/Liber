// @ts-nocheck

require('dotenv').config();

const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

IPFS.create({ repo: process.env.IPFS_REPO }).then(async (ipfs) => {
  const orbitdb = await OrbitDB.createInstance(ipfs, {
    directory: process.env.ORBITDB_DIRECTORY,
    identity: JSON.parse(process.env.ORBITDB_IDENTITY || '{}'),
  });

  const db = await orbitdb.feed('feeds', {
    // TODO restricts users from updating other user's records.
    accessController: {
      type: 'record-based',
    },
  });

  console.log(`FEEDS_DB_ADDRESS=${db.address}`);

  [
    // { dbPath: 'explore/places', envVarName: 'EXPLORE_PLACE_DB_ADDRESS' },
    // { dbPath: 'explore/messages', envVarName: 'EXPLORE_MESSAGE_DB_ADDRESS' },
    // { dbPath: 'marketplace/bots/new', envVarName: 'MARKETPLACE_BOT_NEW_DB_ADDRESS' },
    // { dbPath: 'marketplace/stickers/new', envVarName: 'MARKETPLACE_STICKER_NEW_DB_ADDRESS' },
    ['explore/places', 'EXPLORE_PLACE_DB_ADDRESS'],
    ['explore/messages', 'EXPLORE_MESSAGE_DB_ADDRESS'],
    ['marketplace/bots/new', 'MARKETPLACE_BOT_NEW_DB_ADDRESS'],
    ['marketplace/stickers/new', 'MARKETPLACE_STICKER_NEW_DB_ADDRESS'],
  ].forEach(async ([path, envVarName]) => {
    const db = await orbitdb.keyvalue(path, {
      // TODO restricts users from updating other user's records.
      accessController: {
        type: 'record-based',
      },
    });
    console.log(`${envVarName}=${db.address}`);
  });

  [
    ['marketplace/bots/ranking', 'MARKETPLACE_BOT_RANKING_DB_ADDRESS'],
    ['marketplace/stickers/ranking', 'MARKETPLACE_STICKER_RANKING_DB_ADDRESS'],
  ].forEach(async ([path, envVarName]) => {
    const db = await orbitdb.keyvalue(path, {
      accessController: {
        type: 'record-based',
      },
    });
    console.log(`${envVarName}=${db.address}`);
  });
});
