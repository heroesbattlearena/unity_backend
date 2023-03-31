const express = require('express')
const path = require('path')
const SocketIO = require('socket.io')
const colors = require('colors/safe')
const uuidv4 = require('uuid/v4')
const cors = require('cors')
var x11 = require('dashevo/x11-hash-js')
const https = require('https')
const fs = require('fs')

// const path = require('path')

const Game = require('./classes/game')
const app = express()

// adding contract
const ethers = require('ethers')
// add to package json npm i defender-relay-client;

const {
  DefenderRelayProvider,
  DefenderRelaySigner,
} = require('defender-relay-client/lib/ethers')

//@TODO fill with your relay data
const credentials = {
  apiKey: 'BQsHAELGdFb9f9esij5vdLsJmCNd15rd',
  apiSecret: '5k3bBBnLcu59kRbmUP2mGRgD3wrwYdt4K2kMUq8xCAYpTX7tzpHdUnDs3nLLVBg8',
}

const provider = new DefenderRelayProvider(credentials)

const providerForViewing = new ethers.providers.JsonRpcProvider(
  'https://api.avax.network/ext/bc/C/rpc',
)

const signer = new DefenderRelaySigner(credentials, provider, {
  speed: 'fast',
})

const CHIPS_CONTRACT_ABI =
  '[ { "inputs": [ { "internalType": "address", "name": "_receiver", "type": "address" }, { "internalType": "uint256", "name": "_tokenPrice", "type": "uint256" }, { "internalType": "address", "name": "_WaveTokenAddress", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "account", "type": "address" } ], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "account", "type": "address" } ], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "currentChipStack", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "paymentReceived", "type": "event" }, { "inputs": [], "name": "ChipPriceTOKEN", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "NETWORKDECIMALS", "outputs": [ { "internalType": "int256", "name": "", "type": "int256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TOKENDECIMALS", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountToBuy", "type": "uint256" } ], "name": "buyChipsToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_newTokenPrice", "type": "uint256" } ], "name": "changeChipPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_newMaxPurchase", "type": "uint256" } ], "name": "changeMaxPurchase", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_newmaxWithdrawalDay", "type": "uint256" } ], "name": "changeMaxWithdrawal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "chipCounter", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountToChange", "type": "uint256" }, { "internalType": "address", "name": "_PlayerToChange", "type": "address" } ], "name": "executiveChipstackAdd", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountToChange", "type": "uint256" }, { "internalType": "address", "name": "_PlayerToChange", "type": "address" } ], "name": "executiveChipstackSubstract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastWithdrawal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastWithdrawalAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxPurchase", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxWithdrawalDay", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paymentReceiver", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_playerToCheck", "type": "address" } ], "name": "returnPlayerChips", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountToBuy", "type": "uint256" } ], "name": "returnTokenPricePerChipTotal", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_receiver", "type": "address" } ], "name": "setReceiver", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "totalOutstandingChips", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountToWithdraw", "type": "uint256" } ], "name": "withdrawChips", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" } ], "name": "withdrawErc20", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ]'

const address = '0xffC5632F4C728522eB22070eEeb927c4e29d6fe5' // test contract on , replace with avax contract address;

const ERC20_ADDRESS = '0x3CB2b9129f125e392300EC915D28503D0E6C399d'

const ERC20_ABI =
  '[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ]'

const contractDefenderRelay = new ethers.Contract(
  address,
  CHIPS_CONTRACT_ABI,
  signer,
)

const contractChips = new ethers.Contract(
  address,
  CHIPS_CONTRACT_ABI,
  providerForViewing,
)

// Settings
app.set('port', process.env.PORT || 3000)
//app.set('views', path.join(__dirname, '/views'));

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ useNewUrlParser: true }))

// Enable Cors
app.use(cors())

// Public Path
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))

// Routes
app.get('/mobile', (req, res) => {
  res.sendFile(publicPath + '/mobile/index.html')
})

app.get('/desktop', (req, res) => {
  res.sendFile(publicPath + '/desktop/index.html')
})

// Start server
const server = app.listen(app.get('port'), () => {
  console.log(
    x11.keccak(
      '[Splassive] ' +
        colors.blue('♠ ') +
        colors.red('♥') +
        ' Roulette server ' +
        colors.green('♣') +
        colors.yellow(' ♦') +
        ' on port',
      app.get('port'),
    ),
  )

  const used = process.memoryUsage().heapUsed / 1024 / 1024
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`,
  )
})

// Web Sockets
const io = SocketIO(server)
var games = []
Game.io = io

io.on('connection', (socket) => {
  console.log('Player connected', socket.id)
  socket.isReady = false
  socket.emit('player:connected', { message: 'Welcome to Roulette' })
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`)
  })

  EraseEmptyRooms()
  io.emit('room:list', { rooms: GetPublicRooms(), })
  io.emit('Privateroom:list', { rooms: GetPrivateRooms(), })
  socket.on('disconnect', () => {
    console.log(
      socket.username ? socket.username : socket.id,
      'is disconnected',
    )
    let room = socket.myRoom
    let i = socket.gameIndex
    if (i < 0 || typeof i === 'undefined') {
      console.log(
        socket.username ? socket.username : socket.id,
        'Was not part of a room',
      )
      return
    }

    try {
      var index = games[i].players.indexOf(socket)

      if (index > -1) {
        games[i].players.splice(index, 1)
      }
    } catch (err) {
      console.log('Does not belong to any room')
    }
    EraseEmptyRooms()
    console.log(
      socket.username ? socket.username : socket.id,
      'left the room:',
      room,
    )
    let nickname = socket.username
    let playerID = socket.id
    socket.to(room).emit('player:leave', { nickname, playerID })
    io.emit('room:list', { rooms: GetPublicRooms() })
    io.emit('Privateroom:list', { rooms: GetPrivateRooms(), })
  })

  socket.on('player:leave', () => {
    console.log(socket.username ? socket.username : socket.id, 'left the room')
    let room = socket.myRoom
    let i = socket.gameIndex
    console.log('leaved the room', room)

    try {
      let index = games[i].players.indexOf(socket)
      console.log('leaved the room', room)
      if (index > -1) {
        games[i].players.splice(index, 1)
      }
    } catch (err) {
      console.log('Does not belong to any room')
    }
    EraseEmptyRooms()
    let nickname = socket.username
    let playerID = socket.id

    io.in(socket.myRoom).emit('player:leave', { nickname, playerID })
    io.emit('room:list', { rooms: GetPublicRooms() })
    io.emit('Privateroom:list', { rooms: GetPrivateRooms(), })
  })

  socket.on('player:arrived', () => {
    let nickname = socket.username
    let balance = socket.balance
    let medalCount = socket.medalCount
    let avatarID = socket.avatar
    let playerID = socket.id
    socket.to(socket.myRoom).emit('player:arrived', {
      nickname,
      balance,
      medalCount,
      avatarID,
      playerID,
    })
    var round = games[socket.gameIndex]
    socket.emit('room:sync', {
      players: GetPlayersInfoFromRoom(round, socket.id),
    })
  })

  socket.on('room:join', (data) => {
    const room = io.nsps['/'].adapter.rooms[data.room]
    if (room) {
      //If room exist
      if (room.length < 6) {
        // Join room if is not full

        SetSocketPropierties(socket, data, data.room)
        socket.join(data.room)
        socket.gameIndex = GetGameIndex(data.room)
        const i = socket.gameIndex

        if (games[i].players.indexOf(socket) >= 0) return

        games[i].players.push(socket)
        socket.emit('room:joined', {
          balance: data.balance,
          waitTime: games[i].waitTime,
          minBet: games[i].minBet,
          maxBet: games[i].maxBet,
          id: socket.id,
          isEuropean: games[i].isEuropean,
        })
        console.log(data.username, 'Is joining the room...', data.room)
      } else {
        console.log(data.username, 'found room full...')
        socket.emit('err:room', {
          message: 'The room you try to access is full. Choose another.',
          flag: 2,
        })
        return
      }
      socket.myRoom = data.room
      io.emit('room:list', { rooms: GetPublicRooms() })
      io.emit('Privateroom:list', { rooms: GetPrivateRooms(), })
    } else {
      console.log('Room does not exist.')
      socket.emit('err:room', {
        message:
          'The room you try to access does not exist. Choose another or create one.',
        flag: 1,
      })
    }
  })

  socket.on('room:create', (data) => {
    const exist = io.nsps['/'].adapter.rooms[data.room]
    if (exist) {
      socket.emit('err:room', {
        message:
          'You are trying to create a room that already exist. Choose another name.',
        flag: 0,
      })
      return
    }
    const room = data.room ? data.room : uuidv4()
    SetSocketPropierties(socket, data, room)

    console.log(data)

    console.log(
      data.username,
      'Created a new',
      data.isPrivate ? 'Private' : 'Public',
      'room:',
      data.isEuropean ? '[European]' : '[American]',
      room,
    )
    socket.join(room)
    socket.emit('room:joined', {
      balance: data.balance,
      waitTime: data.waitTime,
      minBet: data.minBet,
      maxBet: data.maxBet,
      id: socket.id,
      isEuropean: data.isEuropean,
    })

    games.push(
      new Game(
        room,
        data.isPrivate,
        data.waitTime,
        data.minBet,
        data.maxBet,
        data.isEuropean,
      ),
    )

    socket.gameIndex = games.length - 1
    games[socket.gameIndex].players.push(socket)

    io.emit('room:list', { rooms: GetPublicRooms() })
    io.emit('Privateroom:list', { rooms: GetPrivateRooms(), })
  })

  socket.on('chat_message', (data) => {
    io.in(socket.myRoom).emit('chat_message', data)
  })

  socket.on('bet:update', (data) => {
    try {
      socket.isReady = data.pool.length > 0
      //console.log(data.pool.length, 'Bets:', data.pool);

      socket.to(socket.myRoom).emit('bet:ghost', { data, id: socket.id })

      var round = games[socket.gameIndex]

      if (round.isOnPlay || !socket.isReady) return

      console.log('Starting in game:', socket.gameIndex)
      round.isOnPlay = true

      socket.emit('player:ready', { 'username': socket.username });
      StartRound(round)
    } catch (error) {}
    socket.emit('player:ERROR', { 'username': socket.username +" didn't sign message in time" });
  })

  socket.on('player:balance', (data) => {
    console.log(x11.keccak('Status', data))
    io.in(socket.myRoom).emit('player:balance', {
      balance: data.balance,
      medalScore: data.medalScore,
      id: socket.id,
    })
  })

  //@TODO added to handle new chipBalance!

  socket.on('player:playedTurnUpdateBalance', (data) => {
    try {
      console.log(x11.keccak('Status', data))

      newBalance = contractDefenderRelay.assignNewPlayerBalance(data)
      console.log(x11.keccak('UpdatedBalance', newBalance))
      return newBalance
    } catch (error) {}
  })

  socket.on('player:withdraw', async (data) => {
    try {
      // const result = await contractDefenderRelay.transfer(data.Withdraw[1], data.Withdraw[0]+ "000000000000000000");

      const erc20 = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, signer)
      const tx = await erc20.transfer(
        data.Withdraw[1],
        data.Withdraw[0] + '000000000000000000000',
      )
      const mined = await tx.wait()
      if (mined) {
        console.log('aaaaaa');
        socket.emit('player:response',{
          message:
            'success',
        });
      }

      console.log(tx)
    } catch (error) {
      console.log(error)
      socket.emit('status: Fail')
    }
  })
})

/*
General functions
*/

function GetGameIndex(room) {
  for (let i = 0; i < games.length; i++) if (games[i].room == room) return i
  return -1
}

function StartRound(round) {
  console.log('On Main Timer', round.waitTime)

  io.in(round.room).emit('room:timer', { time: round.waitTime })

  let timeOut = setTimeout(() => {
    clearTimeout(timeOut)
    if (typeof round !== 'undefined' && round !== null) {
      LaunchBall(round)
    } else console.log('There is no round aviable')
  }, round.waitTime * 1000 + 3000)
}

function LaunchBall(round) {
  io.in(round.room).emit('roulette:spin', {
    result: round.getResult(),
    isEuropean: round.isEuropean,
  })
}

function GetPublicRooms() {
  var publicRooms = []
  for (let i = 0; i < games.length; i++) {
    if (games[i].isPrivate) continue

    let name = games[i].room
    let poblation = games[i].players.length
    let isEuropean = games[i].isEuropean
    publicRooms.push({ name, poblation, isEuropean })
  }
  console.log(games.length, 'Public Rooms:', publicRooms.length, publicRooms)
  return publicRooms
}
function GetPrivateRooms() {
  var privateRooms = []
  for (let i = 0; i < games.length; i++) {
    if (games[i].isPrivate) continue

    let name = games[i].room
    let poblation = games[i].players.length
    let isEuropean = games[i].isEuropean
    privateRooms.push({ name, poblation, isEuropean })
  }
  console.log(games.length, 'Private Rooms:', privateRooms.length, privateRooms)
  return privateRooms
}

function EraseEmptyRooms() {
  for (let i = 0; i < games.length; i++) {
    if (games[i].players.length < 1) {
      games[i].resetTimeOut()
      games.splice(i, 1)
    }
  }
  console.log('Games left:', games.length)
}

function GetPlayersInfoFromRoom(round, id) {
  try {
    let players = []
    for (let j = 0; j < round.players.length; j++) {
      if (round.players[j].id === id) continue
      let nickname = round.players[j].username
      let balance = round.players[j].balance
      let medalCount = round.players[j].medalrsCount
      let avatarID = round.players[j].avatar
      let playerID = round.players[j].id
      players.push({ nickname, balance, medalCount, avatarID, playerID })
      return players
    }
  } catch (error) {}
}

function SetSocketPropierties(socket, data, room) {
  socket.username = data.username
  socket.balance = data.balance
  socket.avatar = data.avatar
  socket.medalCount = 0
  socket.myRoom = room
  socket.currentBet = 0
  socket.isReady = false
}
