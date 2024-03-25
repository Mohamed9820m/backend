const express = require('express');

const http = require('http');
const socketIO = require('socket.io');

const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize =require('./Database/configdb')
const cookieParser = require('cookie-parser');
           
const configurationRoute = require('./Routes/configurationroute');
const capteurRoute = require('./Routes/capteurroute')
const userroute = require('./Routes/userroute')
const settingroute = require('./Routes/settingroute')

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
// Socket.io Config
const server = http.createServer(app);
const io = socketIO(server);

const port = 5001;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


app.use('/api/configuration', configurationRoute);
app.use('/api/data', capteurRoute);
app.use('/api/user', userroute);
app.use('/api/signin', settingroute);






// connect the database 
sequelize.sync() // You may use { force: true } to drop and recreate tables 
.then(() => {
  console.log('Database connected');
})
.catch((err) => {
  console.error('Error syncing database:', err);
});


// Socket.io connection
io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

app.use('/socket.io', (req, res) => {
  res.send({ response: 'Socket.IO server is up and running.' }).status(200);
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Start the server
app.listen(port,() => {
  console.log(`Server is running on port ${port}`);

});

