var config = {
    apiKey: "AIzaSyBJumpdG1HIciEg8KA-JLd8CKwj_6Y_pMc",
    authDomain: "rps-online-76238.firebaseapp.com",
    databaseURL: "https://rps-online-76238.firebaseio.com",
    projectId: "rps-online-76238",
    storageBucket: "rps-online-76238.appspot.com",
    messagingSenderId: "1045841190467"
};
firebase.initializeApp(config);
var database = firebase.database();
var connectionsRef = database.ref("/players");
var connectedRef = database.ref(".info/connected");
var con;

connectedRef.on("value", function(snap) {
  if (snap.val()) { 
    con = connectionsRef.push(true);  
    con.onDisconnect().remove();
    console.log(con);
    //con.update().key("1");
    var key = con.getKey(); 
    database.ref("/players/" + key).set({
    	adam: "adam"
    });	
  }
});

connectionsRef.on("value", function(snap) {

});

