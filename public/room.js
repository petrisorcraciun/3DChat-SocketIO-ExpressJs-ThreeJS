if (!Detector.webgl) Detector.addGetWebGLMessage();
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

let networkReady = null;
let socketT = null;
let playerlist = null;
let avatarlist = null;
let playerCharacter = null;

let configOgro = {
  baseUrl: 'http://localhost:3000/3D/ogro/',
  body: 'ogro-light.js',
  skins: ['grok.jpg'],
  weapons: [['weapon-light.js', 'weapon.jpg']],
  animations: {
    move: 'run',
    idle: 'stand',
    jump: 'jump',
    attack: 'attack',
    crouchMove: 'cwalk',
    crouchIdle: 'cstand',
    crouchAttach: 'crattack'
  },
  walkSpeed: 350,
  crouchSpeed: 175
};

let container, camera, scene, renderer;
let characters = [];
let controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false
};
let clock = new THREE.Clock();
let myId = localStorage.getItem("userName")
playerlist = [];
avatarlist = [];


if(localStorage.getItem("personName") == null)
{
  $('#modalDates').modal({backdrop: 'static', keyboard: false})
} else if(dataJSON.list[0].passwordRoom.length > 0){
  $('#mPassword').modal({backdrop: 'static', keyboard: false})
} else {
  
 
  createWorld();
  createCaracter(localStorage.getItem("username"));
  connectRoom();
}


var texture_placeholder,
isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 90, onMouseDownLon = 0,
lat = 0, onMouseDownLa

document.title =  dataJSON.list[0].roomName + " - ChatAPP";
var connect    = document.getElementById('btnConnect');

connect.addEventListener('click', () => {
    localStorage.setItem("personName"  , document.getElementById('personNameInput').value);
    localStorage.setItem("emailAddress", document.getElementById('emailAddress').value);
    location.reload();
})


btnChat.addEventListener('click', () => {
  document.getElementById("unreadMessagesCount").innerHTML = 0;
})
var connectAfterEnterPassword = document.getElementById('btnCheckPassword');
connectAfterEnterPassword.addEventListener('click', () => {
    if(dataJSON.list[0].passwordRoom == document.getElementById('passwordRoomInput').value){
      $('#mPassword').modal('hide')
      connectRoom();
    } else {
        document.getElementById("errPassword").innerHTML = "Incorrect password. Try again";
    }
})  



function createWorld()
{
      if (!Detector.webgl) Detector.addGetWebGLMessage();
        const SCREEN_WIDTH = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;

        container = document.createElement('div');
        document.body.appendChild(container);
        // カメラ追加(遠視投影)
        camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          1,
          4000
        );
        camera.position.set(0, 150, 1300);
        scene           = new THREE.Scene();
        scene.fog       = new THREE.Fog(0x000000, 1000, 4000);
        scene.add(camera);
        scene.add(new THREE.AmbientLight(0x222222));
        var light                 = new THREE.DirectionalLight(0xffffff, 2.25);
        light.position.set(200, 450, 500);
        light.castShadow          = true;
        light.shadowMapWidth      = 1024;
        light.shadowMapHeight     = 1024;
        light.shadowMapDarkness   = 0.95;
        light.shadowCascade       = true;
        light.shadowCascadeCount  = 3;
        light.shadowCascadeNearZ  = [-1.0, 0.995, 0.998];
        light.shadowCascadeFarZ   = [0.995, 0.998, 1.0];
        light.shadowCascadeWidth  = [1024, 1024, 1024];
        light.shadowCascadeHeight = [1024, 1024, 1024];
        scene.add(light);

        
        let gt            = THREE.ImageUtils.loadTexture('http://localhost:3000/grasslight-big.jpg');
        let gg            = new THREE.PlaneGeometry(16000, 16000);
        let gm            = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });
        let ground        = new THREE.Mesh(gg, gm);
        ground.rotation.x = -Math.PI / 2;
        ground.material.map.repeat.set(64, 64);
        ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.receiveShadow = true;
        scene.add(ground);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.setClearColor(scene.fog.color, 1);
        container.appendChild(renderer.domElement);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMapEnabled = true;
        renderer.shadowMapCascade = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
      
        stats = new Stats();
        container.appendChild(stats.domElement);
    
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
      
   
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
 
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 38: /*up*/
    case 87 /*W*/:
      playerCharacter.controls.moveForward = true;
      break;
    case 40: /*down*/
    case 83 /*S*/:
      playerCharacter.controls.moveBackward = true;
      break;
    case 37: /*left*/
    case 65 /*A*/:
      playerCharacter.controls.moveLeft = true;
      break;
    case 39: /*right*/
    case 68 /*D*/:
      playerCharacter.controls.moveRight = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 38: /*up*/
    case 87 /*W*/:
      playerCharacter.controls.moveForward = false;
      break;
    case 40: /*down*/
    case 83 /*S*/:
      playerCharacter.controls.moveBackward = false;
      break;
    case 37: /*left*/
    case 65 /*A*/:
      playerCharacter.controls.moveLeft = false;
      break;
    case 39: /*right*/
    case 68 /*D*/:
      playerCharacter.controls.moveRight = false;
      break;
  }
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  isUserInteracting = true;
  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;
  onPointerDownLon = lon;
  onPointerDownLat = lat;
}

function onDocumentMouseMove( event ) {
  if ( isUserInteracting ) {
    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

  }
}

function onDocumentMouseUp( event ) {
  isUserInteracting = false;

}

function onDocumentMouseWheel( event ) {
  camera.fov -= event.wheelDeltaY * 0.05;
  camera.updateProjectionMatrix();
 
}


function onDocumentTouchStart( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    onPointerDownPointerX = event.touches[ 0 ].pageX;
    onPointerDownPointerY = event.touches[ 0 ].pageY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }
}


function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
    lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    
  }
}




function createCaracter(id) {
  
  let character = new THREE.MD2CharacterComplex();
  character.scale = 3;
  character.controls = controls;
  characters.push(character);
  let baseCharacter = new THREE.MD2CharacterComplex();
  baseCharacter.scale = 3;
  baseCharacter.onLoadComplete = () => {
    let k = 0;
    playerCharacter = characters[k];
    playerCharacter.shareParts(baseCharacter);
    playerCharacter.enableShadows(true);
    playerCharacter.setWeapon(0);
    playerCharacter.setSkin(0);
    playerCharacter.myId = id;
    playerCharacter.root.position.x = 50;
    playerCharacter.root.position.z = 200;
    scene.add(playerCharacter.root);
    k++;
    playerlist.push(playerCharacter);
  };
  baseCharacter.loadParts(configOgro);
}

function connectRoom()
{
      var socket = io({ transports: ['websocket'], upgrade: false });
      var username  = localStorage.getItem("username");

      var roomIDJ = dataJSON.list[0].roomID;
      let clock = new THREE.Clock();
      let delta = clock.getDelta();
      networkReady = true;
      

      socket.on('reconnect', () => {
            networkReady = true;
            socket.emit('join-room', JSON.stringify({
            userName      : localStorage.getItem("username"),
            personName    : localStorage.getItem("personName"), 
            Email         : localStorage.getItem("emailAddress"), 
            roomID        : roomIDJ,
            userToken     : USER_ID,
            silent        : true,
            posX 	        : characters[0].root.position.x,
            posZ	        : characters[0].root.position.z,
            rotY	        : characters[0].root.rotation._y,
            controls      : characters[0].controls,
            delta         : delta
          })
        );
      })

      var USER_ID = null

      if (dataJSON.list[0].adminUser == localStorage.getItem("username"))
      {
        var element = document.getElementById("btnModalAllUsers");
        element.style.display  = "block";
      }

      socket.emit('join-room', 
          JSON.stringify({
              userName      : localStorage.getItem("username"),
              personName    : localStorage.getItem("personName"), 
              Email         : localStorage.getItem("emailAddress"), 
              roomID        : roomIDJ,
              userToken     : USER_ID,
              posX 	        : characters[0].root.position.x,
              posZ	        : characters[0].root.position.z,
              rotY	        : characters[0].root.rotation._y,
              controls      : characters[0].controls,
              delta         : delta
        })
      );

      function onModalAllUsersClick() {
        socket.emit('oModalForAllUsers', dataJSON.list[0].roomID)
      }

      var count = 0;
      function addMute()
      {

        alert(document.getElementById('btnAddMuted').value)

        count++;
        //
      }

      var formElement       = document.getElementById('newMessageForm');
      var formInput         = document.getElementById('m');
      var messagesContainer = document.getElementById('messages');
      var membersList       = document.getElementById('membersList');
      var btnModalAllUsers       = document.getElementById('btnModalAllUsers')

      function onRoomJoin(uuid) {
              //console.log('', uuid)
          USER_ID = uuid
      }

    

      function updateUsersList(users) {
        document.getElementById("list").innerHTML = "";
        document.getElementById("blockedList").innerHTML = "";
        for (var i = 0; i < users.length; i++) {
            var card = document.createElement('div');
            card.className =  "card col-md-3 border ml-2 mb-2 "; 

            var img = document.createElement('img');
            img.src = users[i].ImageURL;
            img.className = "rounded-circle text-center mx-auto mt-2 mb-1";
            img.style  = "height: 80px; width: 80px; border: 2px solid black";
            card.appendChild(img);

            var item        = document.createElement('div');
            item.className  = "card-body shadow";
            item.className  = 'text-gray-700 text-center';

            var fontColor = dataJSON.list[0].adminUser == users[i].userName ? "<font color=red>" : "<font color=black>";

            item.innerHTML = "<span class='dot'></span> " + fontColor + 
                      "<a href='#' class='temp' id=temp" + users[i].userName + "><b> " + users[i].personName + "</b> </a></font><br>" 
                      + (users[i].isMuted == 1 ? '<span class="badge badge-warning mt-1 " style="font-size:11px" > Muted </span>': "")
                      + (dataJSON.list[0].adminUser == users[i].userName ? '<span class="badge badge-danger mt-1" style="font-size:11px" > Admin </span>': "");
            card.appendChild(item);

            addClick(item, users[i].userName, dataJSON.list[0].roomID, localStorage.getItem("username"))

            users[i].isMuted == 1 ? console.log(users[i].userName) : "";
            users[i].isBlocked == 0 ? document.getElementById("list").appendChild(card) : document.getElementById("blockedList").appendChild(card);


            if(users[i].isMuted == 1&& users[i].userName == localStorage.getItem("username"))
            {
                document.getElementById('m').style.display              = "none";
                document.getElementById('btnSendMessage').style.display = "none";
                document.getElementById('messageMuted').innerHTML       = "<b> You cannot add chat messages. You received mute from an admin. Period: " + users[i].mTime + " minutes</b>";
            }

            if(users[i].isBlocked == 1 && users[i].userName == localStorage.getItem("username"))
            {
               $('#mBlocked').modal({backdrop: 'static', keyboard: false});
               document.getElementById("textBlocked").innerHTML = "<b>Reason:</b> <br>" + users[i].reasonBlocked + "<hr><b>Date blocked: </b> <br>" + users[i].timeBlocked 
                  + "<hr> If you wait, maybe the administrator will remove the ban.";
            }
        }
      }


      function addClick(element, userName, roomID, userWhoAsk)
      {
        element.addEventListener('click', function() {
          socket.emit('userDetails', userName, roomID, userWhoAsk);
        });
      }

      function updateCountUsers(users) {
          document.getElementById('connectCount').innerHTML = users.length;
      }

      function addUserMessage(message) {
          var messageItem       = document.createElement('li');
          messageItem.classList.add('message', 'p-2', 'bg-green-100', 'self-end', 'rounded-lg', 'my-2')
          messageItem.innerText = message;
          messagesContainer.appendChild(messageItem);

          var objDiv        = document.getElementById("messages");
          objDiv.scrollTop  = objDiv.scrollHeight;
      }

      function onFormSubmit(event) {
          event.preventDefault();
          var message = formInput.value;
          formInput.value = ''
          socket.emit('chat-message', { userId: USER_ID, msg: message, roomID: dataJSON.list[0].roomID })
          addUserMessage(message)
          return false;
      }

      function onNewMessage(message) {
          var messageItem = document.createElement('li');
          messageItem.innerHTML = '<strong>' + message.sender + '</strong>' + ': ' + message.msg;
          messageItem.classList.add('message', 'p-2', 'bg-blue-200', 'rounded-lg', 'self-start', 'my-2')
          messagesContainer.appendChild(messageItem);
          if(!$('#chatMessage').hasClass('show')){
              document.getElementById("unreadMessagesCount").innerHTML =  parseInt(document.getElementById("unreadMessagesCount").innerHTML) + 1;
              var x = document.getElementById("myAudio");
              x.play();
          }
      }

      function onStatusUpdate(message) {
        var notificagtion = document.getElementById('messageNotification').innerHTML = message;
        $('.toast').toast('show');
      }

      function disableInputChat(message)
      {
        var notificagtion = document.getElementById('messageNotification').innerHTML = message;
        $('.toast').toast('show');

        document.getElementById('m').style.display              = "none";
        document.getElementById('btnSendMessage').style.display = "none";
        document.getElementById('messageMuted').innerHTML       = "<b> You cannot add chat messages. You received mute from an admin. </b>";
      }

      function enableInputChat(message)
      {
        var notificagtion = document.getElementById('messageNotification').innerHTML = message;
        $('.toast').toast('show');

        document.getElementById('m').style.display              = "block";
        document.getElementById('btnSendMessage').style.display = "block";
        document.getElementById('messageMuted').innerHTML       = "";
      }


      function openModalFiles()
      {
          $('#fileModal').modal({backdrop: 'static', keyboard: false})
      }

      formElement.addEventListener('submit', onFormSubmit);
      if (btnModalAllUsers) {
        btnModalAllUsers.addEventListener('click', onModalAllUsersClick);
      }

      if (document.getElementById('btnAddMuted')) {
        document.getElementById('btnAddMuted').addEventListener('click', addMute);
      }

      function userDetailsF(response){
        document.getElementById('nameUser').innerHTML = response[0].personName;
        document.getElementById('tableProfile').innerHTML = "";
        document.getElementById('footerModalProfile').innerHTML = "";

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = "<b>Image: </b>";
        tr.appendChild(td);
        td = document.createElement('td');
        var img = document.createElement('img');
        img.src  = response[0].ImageURL;
        img.style       = "border: 1px solid black; height: 100px; width: 100px";
        img.className = "text-right ml-auto float-right ";
        td.appendChild(img);
        tr.appendChild(td);
        document.getElementById('tableProfile').appendChild(tr);
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.colSpan = 2;
        td.innerHTML = "<hr>";
        tr.appendChild(td);
        document.getElementById('tableProfile').appendChild(tr);
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = "<b>Person name: </b>";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "<b> " + response[0].personName + " </b>";
        td.className = "text-right";
        tr.appendChild(td);
        document.getElementById('tableProfile').appendChild(tr);

        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = "<b>Email: </b>";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = "<b> " + response[0].Email + " </b>";
        td.className = "text-right";
        tr.appendChild(td);
        document.getElementById('tableProfile').appendChild(tr);
        if(response[0].isMuted == 1)
        {
          var tr = document.createElement('tr');
          var td = document.createElement('td');
          td.innerHTML = "<b>Start muted:</b>";
          tr.appendChild(td);
          td = document.createElement('td');
          td.innerText = response[0].mTimeStart;
          td.className = "text-right";
          tr.appendChild(td);
          document.getElementById('tableProfile').appendChild(tr);

          tr = document.createElement('tr');
          td = document.createElement('td');
          td.innerHTML = "<b>Period muted:</b>";
          tr.appendChild(td);
          td = document.createElement('td');
          td.innerText = response[0].mTimeStart + " minutes";
          td.className = "text-right";
          tr.appendChild(td);
          document.getElementById('tableProfile').appendChild(tr);

        }
        if(response[0].isBlocked == 1)
        {
          var tr = document.createElement('tr');
          var td = document.createElement('td');
          td.innerHTML = "<b>Reason blocked:</b>";
          tr.appendChild(td);
          td = document.createElement('td');
          td.innerText = response[0].reasonBlocked;
          td.className = "text-right";
          tr.appendChild(td);
          document.getElementById('tableProfile').appendChild(tr);

          tr = document.createElement('tr');
          td = document.createElement('td');
          td.innerHTML = "<b>Period blocked:</b>";
          tr.appendChild(td);
          td = document.createElement('td');
          td.innerText = response[0].timeBlocked + " minutes";
          td.className = "text-right";
          tr.appendChild(td);
          document.getElementById('tableProfile').appendChild(tr);
        }


        var valueShow = ["10 min","30 min","1 ora","2 ore", "5 ore"];
        var value     = ["10","30","60","120", "300"];

        var selectList = document.createElement("select");
        selectList.className = "col-md-12 border form-control form-control-sm";
        selectList.id = "mySelect";
        

        for (var i = 0; i < valueShow.length; i++) {
          var option = document.createElement("option");
          valueShow.value = value[i];
          option.text     = valueShow[i];
          selectList.appendChild(option);
        }

        document.getElementById('footerModalProfile').appendChild(selectList);

        var reasonInput = document.createElement('textarea');
        reasonInput.className = "col-md-12 border form-control form-control-sm";
        reasonInput.placeholder = "Reason for mute or block";
        document.getElementById('footerModalProfile').appendChild(reasonInput);


        var buttonMute = document.createElement('button');
        buttonMute.className = "bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-md mb-2 btn-sm";
        buttonMute.innerText = response[0].isMuted == 0 ? "Mute": "Remove mute" ;
        buttonMute.style = "width: 200px";
        buttonMute.value = response[0].isMuted;
        document.getElementById('footerModalProfile').appendChild(buttonMute);

        addClickButtonMute(buttonMute, response[0].userName, response[0].isMuted, selectList, reasonInput);

        var buttonBlock = document.createElement('button');
        buttonBlock.className = "bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-md mb-2 btn-sm";
        buttonBlock.innerText = response[0].isBlocked == 0 ? "Block user": "Remove block" ;
        buttonBlock.style = "width: 200px";
        document.getElementById('footerModalProfile').appendChild(buttonBlock);

        $('#userProfile').modal('show')
        $('#mMembers').modal('hide')
      }
 

      // (roomID, userName, isMuted, timeStart, period )

      function addClickButtonMute(element, userName, value, select, reason)
      {
        element.addEventListener('click', function() {
          var isMuted = value == 0 ? 1:0;
          socket.emit('addMutedUser', dataJSON.list[0].roomID, userName, isMuted, "2020-01-06 20:19", select.value, reason.value)
          $('#userProfile').modal('hide')
          //alert("Utilizatorul  " + userName + " din camera " + dataJSON.list[0].roomID + " a fost " + isMuted + " la ora " + new Date() + " pe o perioada de " + );
        });
      }

    let isDrawing = false;
    let x = 0;
    let y = 0;

    /* Get canvas and context */
    const canvas = document.getElementById('sheet');
    var context = canvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width  = $("#contentDrawTable").width();
            canvas.height = $("#contentDrawTable").height();
    }
    resizeCanvas();


    /* Add the event listeners for mousedown, mousemove, and mouseup */
    canvas.addEventListener('mousedown', e => {
        /* Drawing begins */
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });
    
    canvas.addEventListener('mousemove', e => {
        /* Drawing continues */
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    document.getElementById('clearDrawTable').addEventListener('click', function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }, false);
    
    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

   

    function drawLine(context, x1, y1, x2, y2,color = selected_color,from_server = false) {
      var roomID = dataJSON.list[0].roomID;

      if(!from_server)
          socket.emit('update_canvas', JSON.stringify({roomID, x1,y1,x2,y2,color}));
      
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 5;
      context.lineCap = 'round'
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
      }

      socket.on('joined-room'       ,  onRoomJoin)
      socket.on('chat-message'      ,  onNewMessage)
      socket.on('user-connected'    ,  onStatusUpdate)
      socket.on('user-disconnected' ,  onStatusUpdate)
      socket.on('userDetailsReturn' ,  userDetailsF)
      socket.on('addMutedUser'      ,  disableInputChat)
      socket.on('removeMutedUser'   ,  enableInputChat)
      socket.on('oModalForAllUsers' ,  openModalFiles)
      socket.on('room-update'       , 
        function onRoomUpdate(users) {
          updateUsersList(users)
          updateCountUsers(users)
      })
      socket.on('update_canvas',function(data){

        
          let {roomID, x1,y1,x2,y2,color} = JSON.parse(data);

          if(roomID == dataJSON.list[0].roomID)
            drawLine(context,x1,y1,x2,y2,color,true);
      });

      
      animate();

      function createAvatar(avatar) {
        let character = new THREE.MD2CharacterComplex();
        character.scale = 3;
        character.controls = controls;
        characters.push(character);
        let shadowCharacter = new THREE.MD2CharacterComplex();
        shadowCharacter.scale = 3;
        shadowCharacter.onLoadComplete = () => {
          let k = 1 + avatarlist.length;
          let avatarCharacter = characters[k];
          avatarCharacter.shareParts(shadowCharacter);
          avatarCharacter.enableShadows(true);
          avatarCharacter.setWeapon(0);
          avatarCharacter.setSkin(0);
          avatarCharacter.myId = avatar.userName;
          avatarCharacter.controls = avatar.controls;
          avatarCharacter.update(avatar.delta);
          avatarCharacter.root.position.x = avatar.posX;
          avatarCharacter.root.position.z = avatar.posZ;
          avatarCharacter.root.rotation._y = avatar.rotY;
          scene.add(avatarCharacter.root);
          k++;
          avatarlist.push(avatarCharacter);
        };
        shadowCharacter.loadParts(configOgro);
      }

      function onWindowResize(event) {
        renderer.setSize(window.innerWidth, SCREEN_HEIGHT);
        camera.aspect = window.innerHeight / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
      }

      

     

     

      // --- 




      socket.on('message', function(event){
        let data = JSON.parse(event);
    
        if (
          typeof data.length !== 'undefined' &&
          data[data.length - 1].type === 'join'
        ) {
          console.log(`${data[data.length - 1].id} 入室しました`);
          for (let i = 0, cnt = data.length; i < cnt; i++) {
            if (data[i].userName !== myId) {
              createAvatar(data[i]);
            }
          }
        }
    
        if (data.type === 'join') {
          createAvatar(data);
        }

    
        if (data.type == 'move') {
          for (let i = 0, cnt = avatarlist.length; i < cnt; ++i) {
            let orge = avatarlist[i];
            if (data.id === orge.myId) {
              orge.root.position.x = data.posX;
              orge.root.position.z = data.posZ;
              orge.bodyOrientation = data.rotY;
              orge.controls = data.controls;
              orge.update(data.delta);
            }
          }
        }
      });

      // ---

      function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
      }
      
      function render() {
        let delta = clock.getDelta();
        characters[0].update(delta);
      
        if (networkReady) {
          socket.emit(
            'message',
            JSON.stringify({
              type: 'move',
              id: username,
              posX: characters[0].root.position.x,
              posZ: characters[0].root.position.z,
              rotY: characters[0].root.rotation._y,
              controls: characters[0].controls,
              delta: delta
            })
          );

        }
        renderer.render(scene, camera);
      }
      
}


let selected_color = 'red';
function selectColor(color){
    document.getElementsByClassName(selected_color)[0].classList.remove('selected');
    document.getElementsByClassName(color)[0].classList.add('selected');    
    selected_color = color;
}


