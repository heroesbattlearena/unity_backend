const publicIp = require('public-ip');
var fs = require('fs');
var dateFormat = require("dateformat");
const axios = require('axios');
const { stream2buffer } = require('./stream2buffer');
const { FilesApiClient } = require('@chainsafe/files-api-client');
const { getDefaultProvider } = require('ethers');
const { recoverWalletFromMnemonic, LazyMinter } = require('@chainsafe/lazy-minting-voucher-signer');
const { GeneralERC1155Next__factory } = require('@chainsafe/marketplace-contracts');
const dayjs = require('dayjs');

var database = null;
var serverip = '192.168.8.220';
//var serverip = '223.104.236.75';
var port = '16000';
var io;
var socketlist = [];

var lobbyUserList = [];
var BattleUserList = [];

var armySupplyNftId = "63";

const ethers = require("ethers");

const {
    DefenderRelayProvider,
    DefenderRelaySigner,
} = require("defender-relay-client/lib/ethers");

//@TODO fill with your relay data
const credentials = {
    apiKey: "8p7oexcYCCT4iVNDGVNXdr5do8GsB2xL",
    apiSecret: "2zQrk9CqhNuw9krRuvAmfbGLR1CdqydHjqqDNxfKe9c4NDHPAp4CRZcB1mmxCjK9",
};

const provider = new DefenderRelayProvider(credentials);
console.log("Provider :", provider);

const signer = new DefenderRelaySigner(credentials, provider, {
     speed: "fast",
});
console.log("Signer :", signer);

const contract = '[{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"string","name":"_url","internalType":"string"},{"type":"address","name":"_ref","internalType":"contract IStdReference"}]},{"type":"event","name":"ApprovalForAll","inputs":[{"type":"address","name":"account","internalType":"address","indexed":true},{"type":"address","name":"operator","internalType":"address","indexed":true},{"type":"bool","name":"approved","internalType":"bool","indexed":false}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"TransferBatch","inputs":[{"type":"address","name":"operator","internalType":"address","indexed":true},{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256[]","name":"ids","internalType":"uint256[]","indexed":false},{"type":"uint256[]","name":"values","internalType":"uint256[]","indexed":false}],"anonymous":false},{"type":"event","name":"TransferSingle","inputs":[{"type":"address","name":"operator","internalType":"address","indexed":true},{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"id","internalType":"uint256","indexed":false},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"URI","inputs":[{"type":"string","name":"value","internalType":"string","indexed":false},{"type":"uint256","name":"id","internalType":"uint256","indexed":true}],"anonymous":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"addPart","inputs":[{"type":"string","name":"nftName","internalType":"string"},{"type":"uint256","name":"id","internalType":"uint256"},{"type":"uint256","name":"price","internalType":"uint256"},{"type":"string","name":"herotype","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"admin","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"uint256","name":"id","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256[]","name":"","internalType":"uint256[]"}],"name":"balanceOfBatch","inputs":[{"type":"address[]","name":"accounts","internalType":"address[]"},{"type":"uint256[]","name":"ids","internalType":"uint256[]"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"burn","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"uint256","name":"id","internalType":"uint256"},{"type":"uint256","name":"value","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"burnBatch","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"uint256[]","name":"ids","internalType":"uint256[]"},{"type":"uint256[]","name":"values","internalType":"uint256[]"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeEarlySupply","inputs":[{"type":"uint256","name":"supply","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeFreeSupply","inputs":[{"type":"uint256","name":"supply","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeNordSupply","inputs":[{"type":"uint256","name":"supply","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOlympSupply","inputs":[{"type":"uint256","name":"supply","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"earlyHeroesNumber","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"earlyHeroesSupply","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"freeStonesSupply","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"},{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPartById","inputs":[{"type":"uint256","name":"id","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPartByName","inputs":[{"type":"string","name":"_name","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPrice","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isApprovedForAll","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"address","name":"operator","internalType":"address"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"mint","inputs":[{"type":"string","name":"_name","internalType":"string"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nordHeroesNumber","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nordHeroesSupply","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"olympHeroesNumber","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"olympHeroesSupply","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"partIds","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"safeBatchTransferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256[]","name":"ids","internalType":"uint256[]"},{"type":"uint256[]","name":"amounts","internalType":"uint256[]"},{"type":"bytes","name":"data","internalType":"bytes"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"safeTransferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"id","internalType":"uint256"},{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"bytes","name":"data","internalType":"bytes"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setApprovalForAll","inputs":[{"type":"address","name":"operator","internalType":"address"},{"type":"bool","name":"approved","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setURI","inputs":[{"type":"string","name":"newuri","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"supportsInterface","inputs":[{"type":"bytes4","name":"interfaceId","internalType":"bytes4"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferAdmin","inputs":[{"type":"address","name":"newAdmin","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"uri","inputs":[{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdrawBalance","inputs":[]}]';
const address = '0x04742eb8F14Aa13d52625Ab92340fAe639d257CE'
 
console.log('contract will connect');
const connectedContract = new ethers.Contract(
    address,
    contract,
    signer,
)

console.log("Connected :", connectedContract);

exports.initdatabase = function (db) {
    database = db;

    //setInterval(intervalFunc, 1500);

    (async () => {
        // console.log(await publicIp.v4());
        //serverip = await publicIp.v4();
        console.log(serverip);
        //=> '46.5.21.123'

        //console.log(await publicIp.v6());
        //=> 'fe80::200:f8ff:fe21:67cf'
    })();
};

function intervalFunc() {
    console.log('Cant stop me now!');
}

let m_OnlineUserCount = 0;

exports.addsocket = function (id) {
    socketlist.push(id);
}
exports.setsocketio = function (socketio) {
    io = socketio;
};

const Register = function (socket, data) {
    var collection = database.collection('userdatas');
    var nft = database.collection('nft');
    var query = { userid: data.userid };
    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                // can regist new user
                let currentTime = new Date();
                let timel = dateFormat(currentTime, "dddd mmmm dS yyyy h:MM:ss TT");

                var iteminfo = {
                    itemid: 202,
                    itemcount: 100
                };

                var temp_inven = [];
                temp_inven.push(iteminfo);

                var randomnum = '' + Math.floor(100000 + Math.random() * 900000);
                var _name = 'Player' + randomnum;

                var nft_data = {
                    nftType: 'stones',

                }

                var user_data = {
                    userid: data.userid,
                    username: _name,
                    email: "",
                    guildname: "",
                    points: 0.0, //signup_bonus
                    level: 1,
                    exp: 0,
                    created_date: timel,
                    armySupplyNftId: 0,
                    inventory: temp_inven,
                    battletimes: 0,
                    wintimes: 0,
                    rewardwon: 0,
                    totalusecoin: 0,
                    units: 100,
                    totaluseUnit: 0,
                    manabalance: 100,
                    manauseTime: 0,
                    connect: socket.id,
                    winning_amount: 0,
                    status: 1,
                    login_status: "1"
                };

                collection.insertOne(user_data);

                var mydata = {
                    result: 'success',
                    username: _name,
                    useremail: '',
                    guildname: '',
                    points: 0.0,
                    inventory: temp_inven,
                    battletimes: 0,
                    wintimes: 0,
                    rewardwon: 0,
                    totalusecoin: 0,
                    manabalance: 100,
                    totaluseUnit: 0,
                }

            }
            else {
                // already exits user
                mydata = {
                    result: 'exits_user'
                };

            }

            m_OnlineUserCount++;
            io.emit("OnlineUserCount", m_OnlineUserCount);
            console.log("---- REQ_REGISTER_RESULT : ", mydata);
            socket.emit('REQ_LOGIN_RESULT', mydata);
        }
    });
}

exports.LogIn = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, async function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                Register(socket, userInfo);

                mydata = {
                    result: 'ERR_NOUSER'
                };

                //socket.emit('REQ_LOGIN_RESULT', mydata);
                return;
            }
            else {
                //if(result.login_status == '1'){
                //    mydata = {
                //        result:'ERR_LOGINED'
                //    };
                //    socket.emit('REQ_LOGIN_RESULT', mydata);
                //    return;
                //}      

                var manab = result.manabalance;
                var useTime = result.manauseTime;
                if (result.manauseTime > 0) {
                    var timeout = Math.floor(Date.now() / 1000);
                    var deltatime = timeout - result.manauseTime;

                    var deltahour = Math.floor(deltatime / 3600);

                    if (deltahour > 0) {
                        manab += deltahour * 5; // every 1hr, increase 5 mana

                        if (manab > 100) {
                            useTime = 0;
                            manab = 100;
                        }
                        else {
                            useTime += deltahour * 3600;
                        }
                    }

                    console.log(deltahour.toString() + ':' + deltatime.toString());
                }
                console.log(userInfo.userid);
                console.log("tx start");
                // let tx = await connectedContract.balanceOf(userInfo.userid, "63");
                // let txresult = tx.toString();
                // console.log(txresult);
                let txresult = "1";
                var armyCount = 0;
                if(txresult == "1") {
                    var armyCount = 1;
                } 

                collection.updateOne(query, { $set: { manabalance: manab, manauseTime: useTime, connect: socket.id, status: 1, armySupplyNftId: armyCount,  login_status: '1' } }, function (err) {
                    if (err)
                        console.log(err);
                    //else
                    //console.log('- User socket_id:', socket.id);
                });

                var mydata = {
                    result: 'success',
                    username: result.username,
                    useremail: result.email,
                    guildname: result.guildname,
                    inventory: result.inventory,
                    points: result.points,
                    manabalance: manab,
                    battletimes: result.battletimes,
                    wintimes: result.wintimes,
                    rewardwon: result.rewardwon,
                    totalusecoin: result.totalusecoin,
                    totaluseUnit: result.totaluseUnit,
                    armySupplyNft: armyCount,
                    units: result.units
                    //level : result.level,
                    //exp : result.exp
                }

                m_OnlineUserCount++;
                console.log('---' + result.username + ' s LOGIN INFO ---', mydata);
                console.log('-------- OnlineUserCount=' + m_OnlineUserCount);

                io.emit("OnlineUserCount", m_OnlineUserCount);
            }

            socket.emit('REQ_LOGIN_RESULT', mydata);
        }
    });
}

exports.OnDisconnect = function (socket) {
    console.log("---- Disconnect -----", socket.userid, socket.id);
    let userdatas = database.collection('userdatas');
    userdatas.updateOne({ connect: socket.id }, {
        $set: {
            status: 0,
            login_status: '0'
        }
    }, function (err) {
        if (err) throw err;
    });

    userdatas.findOne({ connect: socket.id }, function (err, result) {
        if (err)
            console.log(err);
        else {
            if (result) {
                for (var i = 0; i < lobbyUserList.length; i++) {
                    if (lobbyUserList[i].name == result.userName) {
                        lobbyUserList.slice(i, 1);
                        break;
                    }
                }
            }
        }
    });

    m_OnlineUserCount--;

    if (m_OnlineUserCount < 0)
        m_OnlineUserCount = 0;

    io.emit("OnlineUserCount", m_OnlineUserCount);
    console.log('-------- OnlineUserCount=' + m_OnlineUserCount);
}


exports.LogOut = function (socket, data) {
    var collection = database.collection('userdatas');
    var query = { userid: data.userid };
    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                console.log('logout failed ---');
            }
            else {
                collection.updateOne(query, { $set: { connect: socket.id, status: 1, login_status: '0' } }, function (err) {
                    if (err) throw err;
                    //else
                    //console.log('- User socket_id:', socket.id);
                });
            }
        }
    });
}

exports.AddItems = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        let _inventory = result.inventory;
        let bFind = false;
        let _units = result.units;
        for (let i = 0; i < _inventory.length; i++) {
            if (_inventory[i].itemid == userInfo.itemid) {
                _inventory[i].itemcount += userInfo.itemcount;
                if (_inventory[i].itemid >= 200 && _inventory[i].itemid < 300)
                    _units += userInfo.itemcount;
                bFind = true;
                break;
            }
        }

        var iteminfo = {
            itemid: userInfo.itemid,
            itemcount: userInfo.itemcount
        };

        if (bFind == false) {
            //_inventory.push([userInfo.itemid, userInfo.itemcount]);
            _inventory.push(iteminfo);
            if (iteminfo.itemid >= 200 && iteminfo.itemid < 300)
                _units += userInfo.itemcount;
        }

        var _points = result.points - userInfo.price;
        var _total = result.totalusecoin + userInfo.price;

        collection.updateOne(query, { $set: { inventory: _inventory, units: _units, points: _points, totalusecoin: _total } }, function (err) {
            if (err)
                console.log(err);
        });

        var guild = database.collection('guild');
        var query1 = { name: result.guildname };
        collection.findOne(query1, function (err, result1) {
            if (err) {
                console.log(err);
                return;
            }

            if (result1) {
                var guild_units = result1.units;
                guild_units += userInfo.itemcount;
                guild.updateOne(query1, { $set: { units: guild_units } }, function (err) {
                    if (err) throw err;
                });
            }
        });

        var mydata = {
            result: 'success',
            itemid: userInfo.itemid,
            itemcount: userInfo.itemcount,
            points: _points,
            totalusecoin: _total
        };

        console.log("---- REQ_ADDITEMS_RESULT : ", mydata);
        socket.emit('REQ_ADDITEMS_RESULT', mydata);
    });
}

exports.UseItem = async function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, async function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        let _inventory = result.inventory;
        let _units = result.units;
        for (let i = 0; i < _inventory.length; i++) {
            if (_inventory[i].itemid == userInfo.itemid) {
                _inventory[i].itemcount -= userInfo.itemcount;
                if (_inventory[i].itemid >= 200 && _inventory[i].itemid < 300)
                    _units -= userInfo.itemcount;
                break;
            }
        }

        collection.updateOne(query, { $set: { inventory: _inventory, units: _units } }, function (err) {
            if (err)
                console.log(err);
        });

        var guild = database.collection('guild');
        var query1 = { name: result.guildname };
        collection.findOne(query1, function (err, result1) {
            if (err) {
                console.log(err);
                return;
            }

            if (result1) {
                var guild_units = result1.units;
                guild_units -= userInfo.itemcount;

                guild.updateOne(query1, { $set: { units: guild_units } }, function (err) {
                    if (err) throw err;
                });
            }
        });

        var mydata = {
            result: 'success',
            itemid: userInfo.itemid,
            itemcount: userInfo.itemcount
        };

        console.log("---- REQ_USEITEMS_RESULT : ", mydata);
        socket.emit('REQ_USEITEMS_RESULT', mydata);
    });
}

exports.SyncMana = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                mydata = {
                    result: 'ERR_NOUSER'
                };
            }
            else {
                var timeout = result.manauseTime;
                var mana = result.manabalance;
                if (mana >= userInfo.mana && result.manauseTime == 0) {
                    timeout = Math.floor(Date.now() / 1000); // add 1hr
                }

                collection.updateOne(query, { $set: { manabalance: userInfo.mana, manauseTime: timeout } }, function (err) {
                    if (err) throw err;
                });
            }

            console.log("---- SyncMana : ", userInfo);
        }
    });
}

exports.CheckMana = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, async function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                mydata = {
                    result: 'ERR_NOUSER'
                };
            }
            else {
                var manab = result.manabalance;
                var useTime = result.manauseTime;
                let tx = await connectedContract.balanceOf(userInfo.address, 65);
                let txresult = tx.toString();
                var deltahour = 0;
                if (result.manauseTime > 0) {
                    var timeout = Math.floor(Date.now() / 1000);
                    var deltatime = timeout - result.manauseTime;

                    deltahour = Math.floor(deltatime / 3600);

                    if (deltahour > 0) {
                        var manaRecovery = txresult == "1" ? 15 : 5;
                        manab += manaRecovery * 5; // every 1hr, increase 5 mana

                        if (manab > 100) {
                            useTime = 0;
                            manab = 100;
                        }
                        else {
                            useTime += deltahour * 3600;
                        }
                    }

                    console.log(deltahour.toString() + ':' + deltatime.toString());
                }

                if (deltahour > 0) {
                    collection.updateOne(query, { $set: { manabalance: manab, manauseTime: useTime } }, function (err) {
                        if (err) throw err;
                    });

                    var userdatas = {
                        result: 'success',
                        mana: manab
                    };

                    socket.emit('REQ_CHECKMANA_RESULT', userdatas);
                }

            }

            console.log("---- CheckMana : ", userInfo);
        }
    });
}


exports.EnterLobby = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };

    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result) {
                collection.updateOne(query, { $set: { points: result.points - userInfo.point } }, function (err) {
                    if (err) throw err;
                });
            }
        }
    });

    lobbyUserList.push({ name: userInfo.userName, balance: userInfo.balance, state: 0 });

    var userdatas = {
        result: 'success',
        infos: lobbyUserList
    };

    socket.emit('REQ_ENTERLOBBY_RESULT', userdatas);
}


// find oponent and battle start
exports.ReadyBattle = function (socket, userInfo) {
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };

    for (let i = 0; i < lobbyUserList.length; i++) {
        if (lobbyUserList[i].name == userInfo.userName) {
            lobbyUserList[i].state = 1;
        }
    }
}


exports.GetTopPlayerList = async function (socket) {
    var collection = database.collection('userdatas');
    //collection.find().sort({units : -1}).skip(10).limit(8).toArray(function(err, docs){
    collection.find().sort({ units: -1 }).limit(30).toArray(function (err, docs) {
        if (err) {
            throw err;
        }
        else {
            if (docs.length > 0) {
                //console.log('----users----', docs);

                var users = [];
                for (var i = 0; i < docs.length; i++) {
                    var info = {
                        name: docs[i].username,
                        units: docs[i].units,
                        battletimes: docs[i].battletimes,
                        wintimes: docs[i].wintimes,
                        rewardwon: docs[i].rewardwon
                    };

                    users.push(info);
                }

                var userdatas = {
                    result: 'success',
                    count: docs.length,
                    users: users
                };

                socket.emit('REQ_TOPPLAYERLIST_RESULT', userdatas);
            }
        }
    });
}

exports.SignUp = function (socket, data) {
    let collection = database.collection('websettings');
    let signup_bonus = 0;
    collection.findOne({}, function (err, result) {
        if (err)
            console.log(err);
        else {
            if (result != null) {
                signup_bonus = parseInt(result.signup_bonus);
                var collection = database.collection('userdatas');

                var randomnum1 = '' + Math.floor(100000 + Math.random() * 900000);
                var randomnum2 = '' + Math.floor(100000 + Math.random() * 900000);
                var randomnum = randomnum1 + randomnum2;

                var email = data.useremail;

                var user_data = {
                    username: data.name,
                    userid: randomnum,
                    password: data.password,
                    useremail: email,
                    points: 10000, //signup_bonus
                    level: 1,
                    exp: 0,
                    friend_users: [],
                    created_date: timel,

                    connect: socket.id,
                    winning_amount: 0,
                    status: 1,
                    login_status: "1",
                };

                collection.insertOne(user_data);

                let websettings = database.collection('websettings');
                websettings.findOne({}, function (err, result) {
                    let webdata;
                    if (err)
                        console.log(err);
                    if (result != null) {
                        if (parseInt(result.activeplayer) >= 0) {
                            websettings.updateOne({}, { $set: { activeplayer: parseInt(result.activeplayer) + 1 } }, function (err) {
                                if (err) throw err;
                            });
                        }
                    }
                });

                var mydata = {
                    result: 'success',
                    username: data.name,
                    userid: randomnum,
                    useremail: data.useremail,
                    points: 10000, //signup_bonus
                    level: 1
                }
                //console.log("---- New Registered User : " + name);
                console.log("---- REQ_REGISTER_RESULT : ", mydata);
                socket.emit('REQ_REGISTER_RESULT', mydata);
            }
        }
    });
}


exports.ChangeName = function (socket, data) {
    var collection = database.collection('userdatas');
    var query = { userid: data.userid };
    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                mydata = {
                    result: 'failed'
                };
            }
            else {
                collection.updateOne(query, { $set: { username: data.username } }, function (err) {
                    if (err) throw err;
                    //else
                    //console.log('- User socket_id:', socket.id);
                });
                mydata = {
                    result: 'success'
                    //username : data.username
                };
            }
            socket.emit('REQ_CHANGEINFO_RESULT', mydata);
        }
    });
}
exports.ChangeEmail = function (socket, data) {
    var collection = database.collection('userdatas');
    var query = { userid: data.userid };
    collection.findOne(query, function (err, result) {
        if (err)
            console.log(err);
        else {
            var mydata;
            if (result == null) {
                mydata = {
                    result: 'failed'
                };
            }
            else {
                collection.updateOne(query, { $set: { email: data.email } }, function (err) {
                    if (err) throw err;
                    //else
                    //console.log('- User socket_id:', socket.id);
                });
                mydata = {
                    result: 'success'
                    //email : data.email
                };
            }
            socket.emit('REQ_CHANGEINFO_RESULT', mydata);
        }
    });
}

exports.Valid_UserID = function (socket, data) {
    var collection = database.collection('userdatas');
    collection.find().toArray(function (err, docs) {
        if (err) {
            throw err;
        }
        else {
            if (docs.length > 0) {
                var userdata = docs.filter(function (object) {
                    return (object.userid == data.userid)
                });

                if (userdata.length > 0) {
                    console.log('---- Already Exist Logined User -----');
                    var mydata = {
                        result: 'failed'
                    }
                    socket.emit('REQ_CHECK_ID_RESULT', mydata);
                }
                else {
                    console.log('success');
                    var mydata = {
                        result: 'success'
                    }
                    socket.emit('REQ_CHECK_ID_RESULT', mydata);
                }
            }
            else {
                console.log('success');
                var mydata = {
                    result: 'success'
                }
                socket.emit('REQ_CHECK_ID_RESULT', mydata);
            }
        }
    });
}

exports.Get_Coins = function (data, socket) {
    var collection = database.collection('userdatas');
    var query = { userphone: data.userphone };
    //console.log('userphone:  ' , data.userphone);
    collection.findOne(query, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            var mydata;
            if (result == null) {
                mydata = {
                    result: "failed"
                }
            }
            else {
                mydata = {
                    result: 'success',
                    points: result.points,
                    winning_amount: result.winning_amount,
                }
            }
            //console.log('---- REQ_COIN_RESULT ----', mydata);
            socket.emit('REQ_COIN_RESULT', mydata);
        }
    });
}

exports.GetUserInfo = function (socket, userInfo) {
    //console.log(userInfo.username);
    var collection = database.collection('userdatas');
    var query = { userid: userInfo.userid };
    collection.findOne(query, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log("- Login userinfo :");
            //console.log(result);
            var mydata;
            if (result == null) {
                mydata = {
                    result: "failed"
                }
            }
            else {
                mydata = {
                    result: 'success',
                    username: result.username,
                    userid: result.userid,
                    photo: result.photo,
                    points: result.points,
                    level: result.level
                }
            }
            socket.emit('GET_USERINFO_RESULT', mydata);
        }
    });
}

exports.GetNativeCoinPrice = function (socket, data) {
    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('http://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=' + data.name, {
                headers: {
                    'X-CMC_PRO_API_KEY': '7b070ad5-e5ca-4005-912f-232f6834f50a',
                    'Accepts': 'application/json',
                },
            });
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            socket.emit('REQ_NATIVECOIN_PRICE_RESPONSE', json);
        }
    });
}



exports.GuildNftMint = async function (socket, data) {
    //    console.log("guild nft ----");

    //     try {
    //         if (!signerMnemonic) {
    //           throw new Error("No signer key is configured")
    //         }

    //         if (!minter1155Address) {
    //           throw new Error("No 1155 Minter Address is configured");
    //         }

    //         if (!storageApiKey) {
    //           throw new Error("No Storage API Key is configured");
    //         }

    //         // Query game state to determine whether the user making the request is authorized to mint
    //         const voucherEarned = true

    //         if (!voucherEarned) {
    //           throw new Error("Voucher is not yet earned");
    //         }
    //         // req = socket.request;
    //         // const receiver = req.query.receiver;

    //         // if (!receiver) {
    //         //   throw new Error("Voucher receiver not specified")
    //         // }

    //         // Create metadata for the NFT to be minted
    //         // const imageStream = await axios.get('https://picsum.photos/800.jpg', { responseType: 'stream' }).then(res => res.data);
    //         // const imageBuffer = await stream2buffer(imageStream);

    //         // const image = fs.writeFile('image.jpg',imageBuffer);

    //         const metadata = {
    //           name: `test lazy mint ERC1155 nft`,
    //           description: `ipsum lorem`,
    //         }

    //         const axiosClient = axios.create({
    //           // Disable the internal Axios JSON de serialization as this is handled by the client
    //           transformResponse: []
    //         })
    //         const apiClient = new FilesApiClient({}, storageApiUrl, axiosClient)
    //         apiClient.setToken(storageApiKey)
    //         const uploadResult = await apiClient.uploadNFT(metadata, "blake2b-208")
    //         const provider = getDefaultProvider(80001)
    //         const wallet = (recoverWalletFromMnemonic(signerMnemonic)).connect(provider)
    //         const minterContract = GeneralERC1155Next__factory.connect(minter1155Address, wallet)
    //         const minter = new LazyMinter({ contract: minterContract, signer: wallet })

    //         const voucher = await minter.createVoucher1155({
    //           minPrice: 0,
    //           tokenId: 1,
    //           amount: 1,
    //           nonce: dayjs().valueOf(),
    //           signer: wallet.address,
    //         })
    //         console.log(voucher);
    //         res.send({ ...voucher, uri: uploadResult.cid })
    //       } catch (error) {
    //         console.log(error)
    //         // res.status(503).send("Internal Server Error")
    //       }
}

exports.GetWalletHistories = function (socket, data) {
    let transactions = database.collection('transactions');
    transactions.find().toArray(function (err, docs) {
        if (err) {
            throw err;
        }
        else {
            if (docs.length > 0) {
                var deposits = docs.filter(function (object) {
                    return (object.userid == data.userid)
                });

                if (deposits.length > 0) {
                    let collection = database.collection('withdraws');
                    collection.find().toArray(function (err, docs) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (docs.length > 0) {
                                var withdraws = docs.filter(function (object) {
                                    return (object.userid == data.userid)
                                });

                                if (withdraws.length > 0) {
                                    //console.log('deposits : ', deposits);   
                                    //console.log('withdraws : ', withdraws); 

                                    var mydata = {
                                        result: 'success',
                                        deposits: deposits,
                                        withdraws: withdraws,
                                        deposit_length: deposits.length,
                                        withdraw_length: withdraws.length
                                    };
                                    socket.emit('REQ_WALLET_HIS_RESULT', mydata);
                                }
                            }
                            else {
                                var mydata = {
                                    result: 'failed'
                                };
                                socket.emit('REQ_WALLET_HIS_RESULT', mydata);
                            }
                        }
                    });
                }
            }
            else {
                var mydata = {
                    result: 'failed'
                };
                socket.emit('REQ_WALLET_HIS_RESULT', mydata);
            }
        }
    });
}

exports.CreateGuild = function (socket, data) {
    let guild = database.collection('guild');
    var query = { name: data.guildname };
    guild.findOne(query, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result != null) {
                // same guild exit
                var mydata = {
                    result: 'ERR_SAME_NAME'
                };

                socket.emit('REQ_CREATEGUILD_RESULT', mydata);
            }
            else {
                var collection = database.collection('userdatas');
                var query = { userid: data.ownerid };
                var owner_units = 0;
                collection.findOne(query, function (err, result1) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        //console.log("- Login userinfo :");
                        //console.log(result);
                        var mydata;
                        if (result1) {
                            owner_units = result1.units;
                            console.log("createguild1 units:" + owner_units);
                            collection.updateOne(query, { $set: { guildname: data.guildname } }, function (err) {
                                if (err) throw err;
                            });
                        }

                        var guild_data = {
                            name: data.guildname,
                            owner: data.ownerid,
                            type: data.type,
                            units: owner_units,
                            fund: data.price,
                            members: []
                        };

                        guild.insertOne(guild_data);
                    }
                });

                var mydata = {
                    result: 'success'
                };

                socket.emit('REQ_CREATEGUILD_RESULT', mydata);
            }
        }
    });
}

exports.JoinGuild = function (socket, data) {
    let guild = database.collection('guild');
    var query = { name: data.guildname };
    guild.findOne(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if (result == null) {
                var mydata = {
                    result: 'failed'
                };

                socket.emit('REQ_JOINGUILD_RESULT', mydata);
            }
            else {
                let _members = result.members;

                if (_members.length >= 50) {
                    var mydata = {
                        result: 'ERR_FULL'
                    };

                    socket.emit('REQ_JOINGUILD_RESULT', mydata);
                    return;
                }

                _members.push(data.userid);


                var collection = database.collection('userdatas');
                var query1 = { userid: data.userid };
                var joiner_units = 0;
                var guild_units = 0;
                collection.findOne(query1, function (err, result1) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        //console.log("- Login userinfo :");
                        //console.log(result);
                        var mydata;
                        if (result1) {
                            joiner_units = result1.units;
                            collection.updateOne(query1, { $set: { guildname: data.guildname } }, function (err) {
                                if (err) throw err;
                            });
                        }

                        guild_units = result.units + joiner_units;

                        guild.updateOne(query, { $set: { members: _members, units: guild_units } }, function (err) {
                            if (err) throw err;
                        });
                    }
                });


                var mydata = {
                    result: 'success',
                    guildname: data.guildname,
                    members: _members.length,
                };

                socket.emit('REQ_JOINGUILD_RESULT', mydata);
            }
        }
    });
}

exports.LeaveGuild = function (socket, data) {
    let guild = database.collection('guild');
    var query = { name: data.guildname };
    guild.findOne(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if (result == null) {
                var mydata = {
                    result: 'failed'
                };

                socket.emit('REQ_JOINGUILD_RESULT', mydata);
            }
            else {
                let _members = result.members;

                const index = _members.indexOf(data.userid);
                if (index > -1) { // only splice array when item is found
                    _members.splice(index, 1); // 2nd parameter means remove one item only
                }

                var collection = database.collection('userdatas');
                var query1 = { userid: data.userid };
                var user_units = 0;
                var guild_units = 0;
                collection.findOne(query1, function (err, result1) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        //console.log("- Login userinfo :");
                        //console.log(result);
                        var mydata;
                        if (result1) {
                            user_units = result1.units;
                            collection.updateOne(query1, { $set: { guildname: "" } }, function (err) {
                                if (err) throw err;
                            });
                        }

                        guild_units = result.units - user_units;
                        guild.updateOne(query, { $set: { members: _members, units: guild_units } }, function (err) {
                            if (err) throw err;
                        });
                    }
                });

                var mydata = {
                    result: 'success',
                    guildname: data.guildname,
                    members: _members.length,
                };

                socket.emit('REQ_LEAVEGUILD_RESULT', mydata);
            }
        }
    });
}

exports.GetGuildList = function (socket, data) {
    var collection = database.collection('guild');

    collection.find().toArray(function (err, docs) {
        if (err) {
            throw err;
        }
        else {
            if (docs.length > 0) {
                //console.log('----guild----', docs);
                var guiddata = {
                    result: 'success',
                    guildcount: docs.length,
                    guilds: docs
                };

                socket.emit('REQ_GUILDLIST_RESULT', guiddata);
            }
            else {
                var guiddata = {
                    result: 'failed',
                };

                socket.emit('REQ_GUILDLIST_RESULT', guiddata);
            }
        }
    });
}

exports.GetGuildRatingList = function (socket, data) {
    var collection = database.collection('guild');

    //collection.find().sort({units : -1}).skip(10).limit(8).toArray(function(err, docs){
    collection.find().sort({ units: -1 }).toArray(function (err, docs) {
        if (err) {
            throw err;
        }
        else {
            if (docs.length > 0) {
                console.log('----guild----', docs);
                var guiddata = {
                    result: 'success',
                    guildcount: docs.length,
                    guilds: docs
                };

                socket.emit('REQ_GUILDRATING_RESULT', guiddata);
            }
            else {
                var guiddata = {
                    result: 'failed',
                };

                socket.emit('REQ_GUILDRATING_RESULT', guiddata);
            }
        }
    });
}

exports.Game_End = function (socket, data) {
    var collection = database.collection('userdatas');

    var query = { userid: data.userid };
    collection.findOne(query, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var mydata;
        if (result) {
            var _battletimes = result.battletimes;

            if (data.type == 1) {
                let _inventory = result.inventory;
                let bFind = false;
                for (let i = 0; i < _inventory.length; i++) {
                    if (_inventory[i].itemid == data.rewardItemId) {
                        _inventory[i].itemcount += 1;
                        bFind = true;
                        break;
                    }
                }

                var iteminfo = {
                    itemid: data.rewardItemId,
                    itemcount: 1
                };

                if (bFind == false) {
                    _inventory.push(iteminfo);
                }


                collection.updateOne(query, {
                    $set: {
                        inventory: _inventory,
                        battletimes: result.battletimes + 1,
                        wintimes: result.wintimes + 1,
                        points: result.points + data.rewardCoin,
                        rewardwon: result.rewardwon + data.rewardCoin,
                        totaluseUnit: result.totaluseUnit + data.useUnits
                    }
                }, function (err) {
                    if (err) throw err;
                });
            }
            else {
                collection.updateOne(query, {
                    $set: {
                        battletimes: result.battletimes + 1,
                        points: result.points + data.rewardCoin,
                        rewardwon: result.rewardwon + data.rewardCoin,
                        totaluseUnit: result.totaluseUnit + data.useUnits
                    }
                }, function (err) {
                    if (err) throw err;
                });
            }
        }
    });
}