const mongob = require("mongodb");
const MongoClient = mongob.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://muzammil176:Muzammil%40176@cluster0.wsqbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      _db = client.db("shop");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "no DB found!!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
