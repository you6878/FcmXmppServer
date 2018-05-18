var xmpp = require('simple-xmpp');
var FCM = require('fcm-node');
var serverKey = 'AIzaSyCE9dbdIDgC-TyVNlDyLxQHGpxQkjWu-9I'; //put your server key here
var senderId = '757925985579'
var fcm = new FCM(serverKey);
function sendMessage(title,token) {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        data: {
            title: title,
            body: 'Body of your push notification'
        }
    };
    fcm.send(message, function(err, response){
        if (err == null) {
            console.log("Successfully sent with response: ", response);
        }
    });
}
xmpp.connect({
    jid: senderId+'@gcm.googleapis.com',
    password: serverKey,
    host: 'fcm-xmpp.googleapis.com',
    port: 5235,
    legacySSL: true,
});
xmpp.on('stanza', function (stanza) {
    if (stanza.is('message') && stanza.attrs.type !== 'error') {
        var data = JSON.parse(stanza.getChildText('gcm'));
        console.log(data)
        if (data.data) {
            sendMessage(data.data.message,data.from)
        }
    }
});
