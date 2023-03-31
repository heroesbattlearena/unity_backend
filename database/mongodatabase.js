var MongoClient = require('mongodb').MongoClient;
//var URL = 'mongodb://localhost:27017/Battle';
var URL = 'mongodb+srv://gerasimchikalex:aA23052005aA@battle.w4g8sc4.mongodb.net/test';
//var URL = process.env.MONGODB_URI;
var state = {
    db: null,
};

exports.connect = function(done) {
    if (state.db)
        return done();

    MongoClient.connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
        if (err)
            return done(err);
        var db = client.db('Battle');
        state.db = db;
        done();
    });
};

exports.get = function() {
    return state.db;
};

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};