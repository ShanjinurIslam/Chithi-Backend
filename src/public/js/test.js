var socket = null
var activeList = document.querySelector('#activeList')
var idSection = document.getElementById('userID')
var control = document.querySelector('#control')
var messageBox = document.querySelector('#messageBox')
var messages = document.querySelector('#messages')

var joined = false ;
var senderID = -1 ;

control.addEventListener('click',(e)=>{
    e.preventDefault()
    if(joined){
        var receiverID = idSection.value
        var message = messageBox.value
        
        var object = new Object()
        object['senderID'] = senderID
        object['receiverID'] = receiverID
        object['message'] = message

        messages.innerHTML += `<small>${object.senderID}</small><br/><lead>${object.message}</lead><br/>`

        socket.emit('send_message',object)
    }
    else{
        senderID = idSection.value;
        socket = io({query:'id='+senderID})
        joined = true;
        idSection.placeholder = 'Receiver ID'
        idSection.value = ''
        messageBox.hidden = false
        control.textContent = 'Send'

        socket.on('new_user',(user)=>{
            activeList.innerHTML += `<h5><${user._id},${user.username}></h5>`
        })

        socket.on('active_list',(users)=>{
            console.log('active_list found',users)
            for(var i=0;i<users.length;i++){
                activeList.innerHTML += `<h5><${users[i]._id},${users[i].username}></h5>`
            }
        })

        socket.on('receive_message',(message)=>{
            messages.innerHTML += `<small>${message.senderID}</small><br/><lead>${message.message}</lead><br/>`
        })
    }
})


