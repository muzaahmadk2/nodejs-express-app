const mongob = require("mongodb");
const MongoClient = mongob.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://muzammil176:Muzammil%40176@cluster0.wsqbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
