import { format } from 'date-fns';
import Dexie from 'dexie';

const targetDbList = [
  'liber',
  'ipfs',
  'ipfs/blocks',
  'ipfs/datastore',
  'ipfs/keys',
  'ipfs/pins',
];

export interface DBObject {
  [dbName: string]: TableObject;
}
interface TableObject {
  [tableName: string]: { values: any[]; keys: string[] };
}

const getAllIdb = async (): Promise<DBObject> => {
  return targetDbList.reduce(async (dbAccm, dbName): Promise<DBObject> => {
    const db = await new Dexie(dbName).open();
    const dbData = db.tables.reduce(
      async (tableAccm, table): Promise<TableObject> => {
        const tableName: string = table.name;
        const values = await db.table(tableName).toCollection().toArray();
        const keys = await db.table(tableName).toCollection().keys();
        return {
          ...tableAccm,
          [tableName]: {
            values,
            keys,
          },
        };
      },
      {}
    );
    return {
      ...dbAccm,
      [dbName]: dbData,
    };
  }, {});
};

const setAllIdb = async (data: DBObject): Promise<void> => {
  return Object.keys(data).forEach(async (dbName) => {
    const db = await new Dexie(dbName).open();
    await db.delete();
    Object.keys(data[dbName]).forEach(async (tableName) => {
      const tableData = data[dbName][tableName];
      db.table(tableName)
        .bulkAdd(tableData.values, tableData.keys, { allKeys: true })
        .catch((e) => {
          console.error('IndexedDB Transaction Error', e);
        });
    });
  });
};

export const downloadIdbBackup = async (): Promise<void> => {
  const dbData = await getAllIdb();
  const json = JSON.stringify(dbData);
  const blob = new Blob([json], {
    type: 'text/json',
  });
  const blobUrl = URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.href = blobUrl;
  tempLink.download = `LiberBackup_${format(new Date(), 'yyyyMMdd')}.json`;
  tempLink.click();
};

export const uploadIdbBackup = async (): Promise<void> => {
  const tempLink = document.createElement('input');
  tempLink.type = 'file';
  tempLink.accept = 'application/json';
  tempLink.click();
  tempLink.onchange = () => {
    const fileList = tempLink.files || [];
    if (0 < fileList.length) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const readFile = event.target?.result;
        if (typeof readFile !== 'string')
          throw Error('Unexpected File Type Error.');
        const dbData: DBObject = JSON.parse(readFile);
        setAllIdb(dbData);
      };
      reader.readAsText(file);
    }
  };
};
