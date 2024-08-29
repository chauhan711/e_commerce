const express = require('express');
const db = require('./db.js');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const socketIO = require('socket.io');
const http = require('http');
let server = http.createServer(app);
var io = socketIO(server);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use('/public', require('./routes/public.route.js'));
app.use('/server', require('./routes/web.route.js'));
app.use('/server/admin',require('./routes/admin.route.js'));
app.use('/server/saler',require('./routes/saler.route.js'));
app.use('/server/user',require('./routes/user.route.js'));

// make connection with user from server side
// make a connection with the user from server side
io.on('connection', (socket)=>{
    console.log('New user connected');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});