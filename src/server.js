const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const appMiddlewares = require('./middlewares/app-middleware');
const appRoutes = require('./routes/index.js');
const logEvent = require('./events/myEmitter')
const loggingListener = require('./events/logging.listener');
const cors = require('cors');

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
var allowedOrigins = ['http://localhost:3000',
    'http://attendance-web.isra-km.my.id'];


const app = express();
loggingListener();
// app.use(cors(corsOptions))
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(appMiddlewares);
app.use(appRoutes);


const server = http.createServer(app);

const io = socketIo(server)
io.on('connect', function (socket) {
    console.log(socket.id);
});

server.on('error', function (e) {
    logEvent.emit('APP-ERROR', {
        logTitle: 'APP-FAILED',
        logMessage: e
    });
});

module.exports = server;
