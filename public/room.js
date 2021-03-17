if (!Detector.webgl) Detector.addGetWebGLMessage();
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

let networkReady = null;
let socketT = null;
let playerlist = [];
let avatarlist = [];
let playerCharacter = { };


let camera, scene, renderer, stats;
let mixer;
let petIsActive = false;


let controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false
};
let clock = new THREE.Clock();
let myId = localStorage.getItem("userName")

let characters = [];

if(localStorage.getItem("personName") == null)
{
  $('#modalDates').modal({backdrop: 'static', keyboard: false})
} else if(dataJSON.list[0].passwordRoom.length > 0){
  $('#mPassword').modal({backdrop: 'static', keyboard: false})
} else {
  createWorld();
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
        const SCREEN_WIDTH  = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;

        container = document.createElement('div');
        document.body.appendChild(container);
       
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
        
        camera.position.set( 0, 150, 600 );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xbfd1e5 );
				//scene.background = new THREE.Color( 0xa0a0a0 );
				//scene.fog = new THREE.Fog( 0xa0a0a0, 1000, 5000 );
        scene.add(camera);
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 200, 0 );
				scene.add( hemiLight );
				const dirLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				dirLight.position.set( 0, 200, 0 );
				scene.add( dirLight );
        const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
		    mesh.rotation.x = - Math.PI / 2;
		    mesh.receiveShadow = true;
				scene.add( mesh );
				const grid = new THREE.GridHelper( 5000, 40, 0x000000, 0x000000 );
		    grid.material.opacity = 0.2;
	    	grid.material.transparent = true;
		    scene.add( grid );


        let gt            = THREE.ImageUtils.loadTexture('../../grasslight-big.jpg');
        let gg            = new THREE.PlaneGeometry(16000, 16000);
        let gm            = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });
        let ground        = new THREE.Mesh(gg, gm);
        ground.rotation.x = -Math.PI / 2;
        ground.material.map.repeat.set(64, 64);
        ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.receiveShadow = true;
        scene.add(ground);


        renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );
        stats = new Stats();
        container.appendChild(stats.domElement);

        const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 100, 0 );
        controls.update();


				window.addEventListener( 'resize', onWindowResize );

        //document.addEventListener('keydown', onKeyDown, false);
        //document.addEventListener('keyup', onKeyUp, false);
}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
 
}

function onKeyDown(event) {
  console.log(playerCharacter)
  switch (event.keyCode) {
    case 38: /*up*/
    case 87 /*W*/:
      playerCharacter.position.x += 5;
      break;
    case 40: /*down*/
    case 83 /*S*/:
      playerCharacter.position.x -= 5;
      break;
    case 37: /*left*/
    case 65 /*A*/:
      playerCharacter.position.z += 5;
      break;
    case 39: /*right*/
    case 68 /*D*/:
      playerCharacter.position.z -= 5;
      break;
  }


  

}

function onKeyUp(event) {
  console.log(playerCharacter)
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

const animations = {};
const game = this;
let anims = ['Walking', 'Walking Backwards', 'Turn', 'Running', 'Pointing Gesture'];

function createCharacter(id, pozX, pozZ) {
      const loader = new FBXLoader();
      const temp   = [];

			    loader.load( '../../3D/models/fbx/Nathan.fbx', function ( object ) {
					mixer        = new THREE.AnimationMixer( object );
          playerCharacter.mixer = object.mixer;
          temp.push(object);
					object.traverse( function ( child ) {
						if ( child.isMesh ) {
							child.castShadow = true;
							child.receiveShadow = true;
						  }
					  } 
          );

        playerCharacter = temp[0];
        playerCharacter.myId = id;
        playerCharacter.name = id;
        playerCharacter.position.x = pozX;
        playerCharacter.position.z = pozZ;
        scene.add(playerCharacter);

        // animations.Idle = object.animations[0];

        loadNextAnim(loader);
       //createColliders();
    } );
    return temp;
}


function loadNextAnim(loader){
  let anim = anims.pop();

  loader.load( '../../3D/models/anims/' + anim +'.fbx', function( object ){
    animations[anim] = object.animations[0];
    if (anims.length>0){
      loadNextAnim(loader);
    }else{
      createCameras();
      //createColliders();
      delete anims;
      action = "Walking";
      animate();
    }
  });	
}

function createColliders(){
  const geometry = new THREE.BoxGeometry(1500, 440, 500);
  const material = new THREE.MeshBasicMaterial({color:0x222222, wireframe:true});
  
  colliders = [];
  
  for (let x=-5000; x<5000; x+=1000){
      for (let z=-5000; z<5000; z+=1000){
          if (x==0 && z==0) continue;
          const box = new THREE.Mesh(geometry, material);
          box.position.set(x, 250, z);
          scene.add(box);
          colliders.push(box);
      }
  }
  
  const geometry2 = new THREE.BoxGeometry(1000, 500, 1000);
  const stage = new THREE.Mesh(geometry2, material);
  stage.position.set(0, 250, 0);
  colliders.push(stage);
  scene.add(stage);
}



function createFile3D (id) {
  const loader = new FBXLoader();
  const temp   = [];

  loader.load( '../3D/models/fbx/cat/CatMac.fbx', function ( object ) {
      // mixer        = new THREE.AnimationMixer( object );
      // const action = mixer.clipAction( object.animations[0]);
      // action.play();
    temp.push(object);
    file = temp[0];
    file.myId = id;
    file.position.x = 0;
    file.position.z = 0;
    scene.add(file);
  });
}


function createPet (id, pozX, pozY, pozZ) {
  const loader = new FBXLoader();
  const temp   = [];

  loader.load( '../3D/models/fbx/cat/CatMac.fbx', function ( object ) {
      temp.push(object);

      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow    = true;
          child.receiveShadow = true;
          }
        } 
      );

    pet = temp[0];
    pet.myId = id;
    pet.name = "Pet" + id;
    pet.position.x = pozX + 50;
    pet.position.z = pozZ + 50;
    scene.add(pet);
  });

  return temp;
}



function connectRoom()
{
      var socket    = io({ transports: ['websocket'], upgrade: false });
      var username  = localStorage.getItem("username");

      var roomIDJ   = dataJSON.list[0].roomID;
      let clock     = new THREE.Clock();
      let delta     = clock.getDelta();
      networkReady  = true;

      socket.on('reconnect', () => {
            networkReady = true;
            socket.emit('join-room', JSON.stringify({
            userName      : localStorage.getItem("username"),
            personName    : localStorage.getItem("personName"), 
            Email         : localStorage.getItem("emailAddress"), 
            roomID        : roomIDJ,
            userToken     : USER_ID,
            silent        : true,
            posX 	        : Math.floor(Math.random() * Math.floor(Math.random() * 500)),
            posZ	        : Math.floor(Math.random() * Math.floor(Math.random() * 1000)),
            rotY	        : characters[0].rotation._y,
            controls      : characters[0].controls,
            delta         : delta
          }),
          
        );
      });


      socket.emit('join-room', 
          JSON.stringify({
              userName      : localStorage.getItem("username"),
              personName    : localStorage.getItem("personName"), 
              Email         : localStorage.getItem("emailAddress"), 
              roomID        : roomIDJ,
              userToken     : USER_ID,
              posX 	        : Math.floor(Math.random() * Math.floor(Math.random() * 500)),
              posZ	        : Math.floor(Math.random() * Math.floor(Math.random() * 1000)),
              rotY	        : 0,
              controls      : "right",
              delta         : delta
        }),
      );  

      

      // event call pet

      var btnCallPet = document.getElementById('btnCallPet');
      btnCallPet.addEventListener('click', () => {
          var selectedObject = scene.getObjectByName(localStorage.getItem("username"));
          var position = {x: selectedObject.position.x, y: selectedObject.position.y, z: selectedObject.position.z}
          socket.emit('callPet', { roomID: dataJSON.list[0].roomID, userName: localStorage.getItem("username"), position: position});
      })  


      var USER_ID = null

      if (dataJSON.list[0].adminUser == localStorage.getItem("username"))
      {
        var element = document.getElementById("btnModalAllUsers");
        element.style.display  = "block";
      }
      

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
      var btnModalAllUsers  = document.getElementById('btnModalAllUsers')

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
            //img.src = users[i].ImageURL;
            img.className = "rounded-circle text-center mx-auto mt-2 mb-1";
            img.style  = "height: 80px; width: 80px; border: 2px solid black";
            card.appendChild(img);

            var item        = document.createElement('div');
            item.className  = "card-body shadow";
            item.className  = 'text-gray-700 text-center';

            //var fontColor = dataJSON.list[0].adminUser == users[i].userName ? "<font color=red>" : "<font color=black>";

            item.innerHTML = "<span class='dot'></span> " + 
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

      function newFileHas(data){
        //alert("User: " + data.userName + " a incarcat : " + data.fileName);

        createFile3D(data.fileName);

      }


      function callPetServer(data){
        var selectedObject = scene.getObjectByName("Pet" + data.userName);
        if(!petIsActive){
          createPet(data.userName, data.position.x, data.position.y, data.position.z);
          petIsActive = true;
        } else {
            petIsActive = false;
            scene.remove(selectedObject);
        }
      }

      function removeCharacter(username){
        removePet(username);
        var selectedObject = scene.getObjectByName(username);
        scene.remove(selectedObject);
      }

      function removePet(username){
        var selectedObject = scene.getObjectByName("Pet" + username);
        if(selectedObject != null){
          scene.remove(selectedObject);
        }
      }



      socket.on('joined-room'       ,  onRoomJoin)
      socket.on('newFile'           ,  newFileHas)
      socket.on('callPet'           ,  callPetServer)
      socket.on('removeCharacter'   ,  removeCharacter)
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
          
          for(i = 0;i<users.length;i++){
            if(!scene.getObjectByName(users[i].userName))
              createCharacter(users[i].userName, users[i].posX, users[i].posZ)
            }
      })

      socket.on('update_canvas',function(data){
          let {roomID, x1,y1,x2,y2,color} = JSON.parse(data);
          if(roomID == dataJSON.list[0].roomID)
            drawLine(context,x1,y1,x2,y2,color,true);
      });
      
      animate();

      function onWindowResize(event) {
        renderer.setSize(window.innerWidth, SCREEN_HEIGHT);
        camera.aspect = window.innerHeight / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
      }

  
      


      // Upload file 
      var file=$("#file")[0];
      file.onchange=function(){
        var formData=new FormData();
        formData.append('file',file.files[0]);

        var src=file.files[0].name,
        formart=src.split(".")[1]; 
        if(formart=="jpg"||formart=="png" || formart=="docx"||formart=="txt" || formart=="ppt" ||formart=="xlsx"||
           formart=="zip" ||formart=="rar" || formart=="doc")
        {
          $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
              if(data.code>0){
                socket.emit(
                  'newFileHasBeenUploaded', {fileName: data.file, roomID: dataJSON.list[0].roomID, userName: localStorage.getItem("username")});
              }
            } 
          });

        }
      };


}

let selected_color = 'red';
function selectColor(color){
    document.getElementsByClassName(selected_color)[0].classList.remove('selected');
    document.getElementsByClassName(color)[0].classList.add('selected');    
    selected_color = color;
}




function animate() {
  const game = this;
  const dt = new THREE.Clock().getDelta();
  
  requestAnimationFrame( function(){ game.animate(); } );

  if (playerCharacter.mixer!==undefined) playerCharacter.mixer.update(dt);
		
    if (playerCharacter.action=='Walking'){
			const elapsedTime = Date.now() - playerCharacter.actionTime;
			if (elapsedTime>1000 && playerCharacter.move.forward>0){
				action = 'Running';
			}
		}
		
		if (playerCharacter.move !== undefined) movePlayer(dt);

  
  if (playerCharacter.cameras!=undefined && playerCharacter.cameras.active!=undefined){
    camera.position.lerp(playerCharacter.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05);
    const pos = playerCharacter.object.position.clone();
    pos.y += 200;
    camera.lookAt(pos);
  }
  
      
      if (this.sun != undefined){
          this.sun.position.x = playerCharacterCharacter.object.position.x;
          this.sun.position.y = playerCharacterCharacter.object.position.y + 200;
          this.sun.position.z = playerCharacterCharacter.object.position.z + 100;
          this.sun.target = playerCharacterCharacter.object;
      }
      
  renderer.render( scene, camera );

}



function createCameras(){
  const offset = new THREE.Vector3(0, 80, 0);
  const front = new THREE.Object3D();
  front.position.set(112, 100, 600);
  front.parent = playerCharacter.object;
  const back = new THREE.Object3D();
  back.position.set(0, 300, -600);
  back.parent = playerCharacter.object;
  const wide = new THREE.Object3D();
  wide.position.set(178, 139, 1665);
  wide.parent = playerCharacter.object;
  const overhead = new THREE.Object3D();
  overhead.position.set(0, 400, 0);
  overhead.parent = playerCharacter.object;
  const collect = new THREE.Object3D();
  collect.position.set(40, 82, 94);
  collect.parent = playerCharacter.object;
  playerCharacter.cameras = { front, back, wide, overhead, collect };
  game.activeCamera = playerCharacter.cameras.back;	
}