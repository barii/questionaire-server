const { MongoClient } = require('mongodb');

let client;
let db;

beforeEach(async () => {
  client = new MongoClient(global.__MONGO_URI__, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  db = await client.db(global.__MONGO_DB_NAME__);
});

afterEach(async () => {
  //await db.close();
  await client.close();
});

it('should aggregate docs from collection', async () => {
  const files = db.collection('files');

  await files.insertMany([
    {type: 'Document'},
    {type: 'Video'},
    {type: 'Image'},
    {type: 'Document'},
    {type: 'Image'},
    {type: 'Document'},
  ]);

  const topFiles = await files
    .aggregate([
      {$group: {_id: '$type', count: {$sum: 1}}},
      {$sort: {count: -1}},
    ])
    .toArray();

  expect(topFiles).toEqual([
    {_id: 'Document', count: 3},
    {_id: 'Image', count: 2},
    {_id: 'Video', count: 1},
  ]);
});