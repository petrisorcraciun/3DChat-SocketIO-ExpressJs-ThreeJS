const express       = require('express'),
      app           = express(),
      exhbs         = require('express-handlebars'),
      server        = require('http').createServer(app),
      io            = require('socket.io')(server),
      derange       = require('derange'),
      { v4: uuidV4} = require('uuid'),
      bodyParser    = require('body-parser'),
      mysql         = require('mysql'),
      fetch         = require('node-fetch'),
      cors          = require('cors')
      multer        = require('multer');

//var world = require('./js/server_world');

const LocalStorage  = require('node-localstorage').LocalStorage;
localStorage        = new LocalStorage('./scratch');
app.engine('hbs', exhbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());



var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './uploads')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
});

var upload = multer({ storage : storage, limits: {
  fileSize: 1000000 //give no. of bytes
}});

app.post('/upload', upload.single('file'), function (req, res, next) {
  res.json({code : 1, file: req.file.filename});
  res.end();
});

const rooms = { details: [
      {
        "roomID"      : "camera-deschisa",
        "roomName"    : "Camera deschisa",
        "passwordRoom": "",
        "adminUser"   : "petrisorcraciun",
        'createdTime' : "2020-01-05",
        "nrMaxPers"   : 20,
        "ImageURL"    : "https://images-na.ssl-images-amazon.com/images/I/7192GSmRn8L._SL1354_.jpg"
      },
      {
        "roomID"      : "camera-lui-petrisor",
        "roomName"    : "Camera lui Petrisor",
        "passwordRoom": "",
        "adminUser"   : "petrisorcraciun",
        'createdTime' : "2020-01-05",
        "nrMaxPers"   : 20,
        "ImageURL"    : "https://images-na.ssl-images-amazon.com/images/I/7192GSmRn8L._SL1354_.jpg"
      }
] }
const users       = { details: [] }
const blackList   = { list : [] }
const playerlist  = [];

const history = [];

app.get('/', (req, res) => {
  res.render('firstPage');
});

app.get('/home', (req, res) => {
  var roomList = []
  for (var i = 0; i < rooms.details.length; i++) {
    roomList.push(rooms.details[i].roomName);
  }
  res.render('home', { roomsPage: JSON.stringify(rooms.details)});
});



app.post('/room', (req, res) => {
  const newRoomId  = createSlug(req.body.roomName)  

  rooms.details.push({ 
    "roomID"      : createSlug(req.body.roomName),
    "roomName"    : req.body.roomName,
    "passwordRoom": req.body.passwordRoom,
    "adminUser"   : req.body.userName,
    'createdTime' : new Date(),
    "nrMaxPers"   : 20,
    "ImageURL"    : "https://images-na.ssl-images-amazon.com/images/I/7192GSmRn8L._SL1354_.jpg"
  })

  const fs = require('fs');
  const dir = "./roomFiles/" + createSlug(req.body.roomName);
  try {
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      } 
  } catch (err) {
      console.log(err);
  }
  res.status(201). send({ roomPath: '/room/' + newRoomId })
})


app.get('/room/:room', (req, res) => {
  var responseObject = { list: [] }

  for (var i = 0; i < rooms.details.length; i++) {
    if(rooms.details[i].roomID == req.params.room){
      responseObject.list.push({
          "roomID"       : rooms.details[i].roomID,
          "roomName"     : rooms.details[i].roomName,
          "passwordRoom" : rooms.details[i].passwordRoom,
          "adminUser"    : rooms.details[i].adminUser,
          "createdTime"  : rooms.details[i].createdTime,
          "nrMaxPers"    : rooms.details[i].nrMaxPers,
          "ImageURL"     : rooms.details[i].ImageURL,
      });
    }
  }

  /*
  if(!room) {
    res.render('404');
    return
  }

  */
  res.render('room', { detailRoom: JSON.stringify(responseObject)} );
})



io.on('connection', socket => {

  socket.on('join-room', data => {
  
  let jsonData = JSON.parse(data);

  var blackListArray = [0, "", "", "", 0, "", ""];

  for(var i = 0;i < blackList.list.length;i++)
  {
    if(blackList.list[i].userName == jsonData.userName && blackList.list[i].roomID == jsonData.roomID)
    {
        blackListArray[0] = 1;
        blackListArray[1] = blackList.list[i].mTimeStart;
        blackListArray[2] = blackList.list[i].mTime;
        blackListArray[3] = blackList.list[i].reasonMuted;
        blackListArray[4] = blackList.list[i].isBlocked;
        blackListArray[5] = blackList.list[i].reasonBlocked;
        blackListArray[6] = blackList.list[i].timeBlocked;
    }
  }

  users.details.push({
      "roomID"        : jsonData.roomID,
      "userName"      : jsonData.userName,
      "personName"    : jsonData.personName,
      "token"         : jsonData.userToken || uuidV4(),
      "socketID"      : socket.id,
      "Email"         : jsonData.emailAddress,
      "isMuted"       : blackListArray[0],
      "mTimeStart"    : blackListArray[1],
      "mTime"         : blackListArray[2],
      "reasonMuted"   : blackListArray[3],
      "ImageURL"      : "https://carlasbeautybox.files.wordpress.com/2013/11/check-in-minion.jpg",
      "isBlocked"     : blackListArray[4],
      "reasonBlocked" : blackListArray[5],
      "timeBlocked"   : blackListArray[6], 
      "posX"          : jsonData.posX,
      "posZ"          : jsonData.posZ,
      "rotY"          : jsonData.posY,
      "controls"      : jsonData.controls,
      "delta"         : jsonData.delta,
      "type"          : "join"
  });



  for(let item of history)
      socket.emit('update_canvas',item);
    
  if (!jsonData.userToken) {
    socket.emit('joined-room', users.details[users.details.length-1].token)
  }

  socket.emit('message', JSON.stringify(users.details));
  socket.broadcast.emit('message', data);

  socket.join(jsonData.roomID);
  if (!jsonData.silent) {
    socket.to(jsonData.roomID).emit('user-connected', jsonData.personName  + ' joined the room.');
    io.in(jsonData.roomID).emit('room-update', Object.values(users.details).filter(user => user.roomID === jsonData.roomID))
  }
})
  


socket.on('newFileHasBeenUploaded', ({ fileName, roomID, userName }) => {
    var data = {fileName, userName};
    io.in(roomID).emit('newFile', data);
})

socket.on('callPet', ({ roomID, userName, position }) => {
  var data = {roomID, userName, position};
  io.in(roomID).emit('callPet', data);
})



socket.on('chat-message', ({ userId, msg, roomID }) => {
    var senderUsername;
    users.details.forEach((element, index) => {
      if(element.token === userId) {
        senderUsername = element.userName;
      }
    });
    const pkg = { msg, sender: senderUsername }
    socket.to(roomID).broadcast.emit('chat-message', pkg);
})




socket.on('oModalForAllUsers', (roomID) => {
  for (var i = 0; i < users.details.length; i++) {
    io.to(users.details[i].socketID).emit('oModalForAllUsers', '🎁&nbsp;&nbsp;You are secret santa!')
  }
})


socket.on('addMutedUser', (roomID, userName, isMuted, timeStart, period, reason ) => {
  
  var userSocket;
  for (var i = 0; i < users.details.length; i++) {
    if(users.details[i].roomID == roomID && users.details[i].userName == userName) {
      users.details[i].isMuted    = isMuted;
      users.details[i].mTimeStart = timeStart;
      users.details[i].mTime      = period;
      users.details[i].reasonMuted= reason;
      userSocket = users.details[i].socketID;
    }
  }


  blackList.list.push(
    {
        "roomID"        : roomID,
        "userName"      : userName,
        "isMuted"       : isMuted,
        "mTimeStart"    : timeStart,
        "mTime"         : period,
        "isBlocked"     : "",
        "reasonBlocked" : "",
        "timeBlocked"   : "",
    }
  )

  if(isMuted == 1)
    io.to(userSocket).emit('addMutedUser', 'User: ' + userName + " was silenced for a period of " + period + " minutes.")
  else 
  io.to(userSocket).emit('removeMutedUser', 'User: ' + userName + " received unmuted from an admin.")
})


socket.on('userDetails', (userName, roomID, userWhoAsk) => {

  var userSocket;
  for (var i = 0; i < users.details.length; i++) {
    if(users.details[i].roomID == roomID && users.details[i].userName == userWhoAsk) {
      userSocket = users.details[i].socketID;
    }
  }
    io.to(userSocket).emit('userDetailsReturn', Object.values(users.details).filter(user => user.roomID === roomID && user.userName === userName))
})

socket.on('update_canvas',function(data){
  history.push(data);

  io.in(JSON.parse(data).roomID).emit('update_canvas', data)
});




socket.on('disconnect', (reason) => {
    var disconnectedUser = null;

    users.details.forEach((element, index) => {
      if(element.socketID == socket.id) {
        disconnectedUser = element;
      }
    });


    if (reason === 'transport close') {

      socket.to(disconnectedUser.roomID).emit('user-disconnected', disconnectedUser.userName + ' left the room');
      io.in(disconnectedUser.roomID).emit('removeCharacter', disconnectedUser.userName)
      //delete users[disconnectedUser.socketID]
      users.details.forEach((element, index) => {
        if(element.socketID == socket.id) {
          users.details.splice(index, 1);
        }
      });
      io.in(disconnectedUser.roomID).emit('room-update', Object.values(users).map(({ userName }) => userName ))
      
    }

})
})


server.listen(3000, () => {
  console.log("URL: http://localhost:3000/");
});


function createSlug(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}




