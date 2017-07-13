var rps = {
	player1: undefined,
	player2: undefined,
	key: undefined,

	init: function(){
		var config = {
		    apiKey: "AIzaSyBJumpdG1HIciEg8KA-JLd8CKwj_6Y_pMc",
		    authDomain: "rps-online-76238.firebaseapp.com",
		    databaseURL: "https://rps-online-76238.firebaseio.com",
		    projectId: "rps-online-76238",
		    storageBucket: "rps-online-76238.appspot.com",
		    messagingSenderId: "1045841190467"
		};
		firebase.initializeApp(config);
		this.database = firebase.database();
		this.connectionsRef = this.database.ref("/players");
		this.connectedRef = this.database.ref(".info/connected");	

		rps.connectedRef.on("value", function(snap) {
	  		if (snap.val()) { 
			    rps.connection = rps.connectionsRef.push(true);  
			    rps.connection.onDisconnect().remove();
			    rps.key = rps.connection.getKey(); 
	  		}
		});

		rps.database.ref("/players").on("value", function(snapshot){
			console.log('reached');
		}, function(errorObject){
			console.log("There was an error: " + errorObject.code);
		});
	}
}


$(document).ready(function(){
	rps.init();


	$(document).on("click", "#submit-name", function(){
		console.log("clicked");
		var name = $("#player-name").val().trim();
		if(rps.player1 === undefined){
			rps.player1 = name;
			rps.database.ref("/players/" + rps.key).set({
				name: name,
				position: 1
			});
		} else if (rps.player2 === undefined){
			rps.player2 = name;
			rps.database.ref("/players/" + rps.key).set({
				name: name,
				position: 2
			});
		}
		$(document).off("click", "#submit-name");
	});
});

