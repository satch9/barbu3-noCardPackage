const _ = require('lodash');
const express = require('express');
const { v4: uuid4 } = require('uuid');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { getRoom, broadcast } = require('./src/utils/utils');

const port = process.env.PORT || 9000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'htt://localhost:5173',
        methods: ['GET', 'POST']
    }
});

let storage = require('node-persist');


const Room = require('./src/models/Room')
const Player = require('./src/models/Player')

let users = {};
let rooms = {};

// routes
app.get('/', (req, res) => {
    console.log('req.body', req.body)
});

// login page route (POST) 
app.post('/register', (req, res) => {
    //console.log('req.body', req.body)
    const { username, password, email } = req.body;
    const id = uuid4();

    //console.log('username', username, 'password', password, 'id', id, 'email', email)

    if (!username || username.length > 20 || _.includes(_.values(users), username)) {
        res.redirect('/');
    }
    let hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    users[id] = { username, id };

    res.cookie('barbu', id, { maxAge: 900000, httpOnly: true });
    res.json({ user: users[id] });

});


io.on('connection', socket => {
    let regex = /barbu=([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})/i;
    let match = regex.exec(socket.handshake.headers.cookie);
    let username = match ? users[match[1]].username : null;

    if (!username) {
        socket.disconnect();
        return;
    }

    console.log(username, 'connected. Cookie:', match[1], 'Socket:', socket.id);

    socket.emit('rooms', _.map(rooms, room => ({
        id: room.id,
        players: _.map(room.players, 'username'),
        scores: _map(room.player, 'score'),
        history: room.history,
        finished: room.finished,
    }))
    );

    socket.on('join', name => {
        if (!_.has(rooms, name)) {
            rooms[name] = new Room(name)
        }

        let room = rooms[name];
        let playerIndex = room.players.length;

        if (playerIndex < 4) {
            socket.emit('room', room.name);
            socket.emit('me', playerIndex);
            room.players.push(new Player(username, socket));
            broadcast(room.players, 'players', _.map(room.players, 'username'));
            broadcast(room.players, 'connected', username);

            console.log(username, 'joined room', room.name);

            io.emit('rooms', _.map(rooms, room => ({
                id: room.id,
                players: _.map(room.players, 'username'),
                scores: _map(room.player, 'score'),
                history: room.history,
                finished: room.finished,
            })));

            if(room.players.length === 4) {
                startGame(room);
            }
        }

    })

    socket.on('disconnect', () => {
        let room = getRoom(username);
        if (room) {
            broadcast(room.players, 'disconnected', username);
            room.players = _.reject(room.players, ['username', username]);
        }
    });
});

// Save users and rooms on process exit

process.on('SIGINT', function () {

    Promise.all([
        storage.setItem('users', users),
        storage.setItem('rooms', rooms)
    ])
        .then(() => process.exit())

});

// Load users and rooms on server start

storage.init({

    // Discard socket object when saving rooms
    stringify: value => JSON.stringify(value, (k, v) => k === 'socket' ? {} : v)

}).then(() => {
    Promise.all([
        storage.getItem('users', users),
        storage.getItem('rooms', rooms)
    ])
        .then(results => {

            users = results[0] || {}
            rooms = results[1] || {}

            server.listen(port, () => console.log('[*] barbu.js listening on *:9000'))

        })
});