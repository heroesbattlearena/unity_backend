

var events = require('events');
var eventemitter = new events.EventEmitter();
var db = require('../database/mongodatabase');

var gamemanager = require('../game_manager/gamemanager');
var loginmanager = require('../room_manager/loginmanager');
var database = null;

exports.initdatabase = function () {
    db.connect(function (err) {
        if (err) {
            console.log('Unable to connect to Mongo.');
            console.log(err);
            process.exit(1);
        }
        console.log('Connected to the DB.');
        database = db.get();
        loginmanager.initdatabase(database);
        gamemanager.initdatabase(database);
    });

};

exports.initsocket = function (socket, io) {
    loginmanager.setsocketio(io);
    loginmanager.addsocket(socket.id);
    gamemanager.setsocketio(io);
    gamemanager.addsocket(socket.id);

    socket.on('REQ_LOGIN', function (data) {
        console.log('----- LOGIN  ----- : ', data);
        loginmanager.LogIn(socket, data);
    });

    socket.on('REQ_LOGOUT', function (data) {
        console.log('----- LOGOUT ----- : ', data);
        loginmanager.LogOut(socket, data);
    });

    // Register
    socket.on('REQ_REGISTER', function (data) {
        console.log('----- REGISTER ----- : ', data);
        loginmanager.Register(socket, data);
    });

    socket.on('REQ_CHANGENAME', function (data) {
        console.log('----- CHANGENAME ----- : ', data);
        loginmanager.ChangeName(socket, data);
    });
    socket.on('REQ_CHANGEEMAIL', function (data) {
        console.log('----- CHANGEEMAIL ----- : ', data);
        loginmanager.ChangeEmail(socket, data);
    });
    socket.on('REQ_CREATEGUILD', function (data) {
        console.log('----- CREATEGUILD ----- : ', data);
        loginmanager.CreateGuild(socket, data);
    });
    socket.on('REQ_JOINGUILD', function (data) {
        console.log('----- JOINGUILD ----- : ', data);
        loginmanager.JoinGuild(socket, data);
    });
    socket.on('REQ_LEAVEGUILD', function (data) {
        console.log('----- LEAVEGUILD ----- : ', data);
        loginmanager.LeaveGuild(socket, data);
    });
    socket.on('REQ_GUILDLIST', function (data) {
        console.log('----- GETGUILDLIST ----- : ', data);
        loginmanager.GetGuildList(socket, data);
    });
    socket.on('REQ_INVENTORY', function (data) {
        console.log('----- REQ_INVENTORY ----- : ', data);
        loginmanager.GetInventory(socket, data);
    });
    socket.on('REQ_ADDITEMS', function (data) {
        console.log('----- REQ_ADDITEMS ----- : ', data);
        loginmanager.AddItems(socket, data);
    });
    socket.on('REQ_USEITEMS', function (data) {
        console.log('----- REQ_UseITEM ----- : ', data);
        loginmanager.UseItem(socket, data);
    });
    socket.on('REQ_SYNCMANA', function (data) {
        console.log('----- REQ_SYNCMANA ----- : ', data);
        loginmanager.SyncMana(socket, data);
    });
    socket.on('REQ_CHECKMANA', function (data) {
        console.log('----- REQ_CHECKMANA ----- : ', data);
        loginmanager.CheckMana(socket, data);
    });
    socket.on('REQ_ENTERLOBBY', function (data) {
        console.log('----- REQ_ENTERLOBBY ----- : ', data);
        loginmanager.EnterLobby(socket, data);
    });
    socket.on('REQ_READYBATTLE', function (data) {
        console.log('----- REQ_READYBATTLE ----- : ', data);
        loginmanager.ReadyBattle(socket, data);
    });
    socket.on('REQ_TOPPLAYERLIST', function (data) {
        console.log('----- REQ_TOPPLAYERLIST ----- : ', data);
        loginmanager.GetTopPlayerList(socket, data);
    });
    socket.on('REQ_TOPGUILDLIST', function (data) {
        console.log('----- REQ_TOPGUILDLIST ----- : ', data);
        loginmanager.GetGuildRatingList(socket, data);
    });
    socket.on('Game_End', function (data) {
        console.log('----- Game_End ----- : ', data);
        loginmanager.Game_End(socket, data);
    });
    socket.on('REQ_INVITEREPLY', function (data) {
        console.log('----- REQ_INVITEREPLY ----- : ', data);
        loginmanager.InviteReply(socket, data);
    });

    socket.on('REQ_ADDFRIEND', function (data) {
        console.log('----- REQ_ADDFRIEND ----- : ', data);
        loginmanager.ReqAddFriend(socket, data);
    });

    socket.on('REQ_ADDFRIENDREPLY', function (data) {
        console.log('----- REQ_ADDFRIENDREPLY ----- : ', data);
        loginmanager.AddFriendReply(socket, data);
    });

    socket.on('REQ_REMOVEFRIEND', function (data) {
        console.log('----- REQ_REMOVEFRIEND ----- : ', data);
        loginmanager.DelFriend(socket, data);
    });
    socket.on('REQ_CHANGE_PASSWORD', function (data) {
        loginmanager.ChangePassword(socket, data);
        console.log('new Password : ', data);
    });

    // Get user list in the room
    socket.on('REQ_USERLIST_ROOM', function (data) {
        //gamemanager.GetUserListInRoom(data.roomid);
    });

    socket.on('REQ_NATIVECOIN_PRICE', function (data) {
        loginmanager.GetNativeCoinPrice(socket, data);
     
    });

    // socket.on('REQ_GUILDNFT_MINT', function (data) {
    //     console.log("guild nft");
    //     loginmanager.GuildNftMint(socket, data);
    //     console.log('name : ',data);
    // });

    // disconnect
    socket.on('disconnect', function () {
        console.log("----- DISCONNECTED -----");
        loginmanager.OnDisconnect(socket);
        //gamemanager.OnDisconnect(socket);
    });
    socket.on('reconnect', (attemptNumber) => {
        console.log(attemptNumber);
    });
}