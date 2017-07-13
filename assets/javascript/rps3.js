var id;
var opponent;
var opponentName;
var madeChoice = false;
var config = {
    apiKey: "AIzaSyBJumpdG1HIciEg8KA-JLd8CKwj_6Y_pMc",
    authDomain: "rps-online-76238.firebaseapp.com",
    databaseURL: "https://rps-online-76238.firebaseio.com",
    projectId: "rps-online-76238",
    storageBucket: "rps-online-76238.appspot.com",
    messagingSenderId: "1045841190467"
};
firebase.initializeApp(config);
database = firebase.database();
//var ref = database.ref("/players");


database.ref("/players").on("value", function(snapshot){
    var player1 = snapshot.child("1").exists();
    var player2 = snapshot.child("2").exists();
    if(player1 && player2){
        var myChoice = playerChoice(id);
        var oppChoice = playerChoice(opponent);
        if(myChoice && oppChoice){
            var winner = playRPS(myChoice, oppChoice);
            if(winner === 1){  //1 if I win
                updateScore(id, 1);
            } 
            else if(winner === 2){ //2 if my opponent wins
                updateScore(id, 0);
            } else {
                addChoice(id, null);  //0 (else) if a tie
            }
            displayPlayer(id);
            displayPlayer(opponent);
        } 
        else if (myChoice){

        } 
        else if (oppChoice){

        } else {
            displayPlayer(id);
            displayPlayer(opponent);
            console.log("waiting for both to players to choose");
        }
    }
    else if(player1){
        console.log("waiting for player2");
        $("#player2").html("Waiting for player");
        displayPlayer(1);
        addChoice(1, null);
    } 
    else if(player2){
        console.log("waiting for player1");
        $("#player1").html("Waiting for player");
        displayPlayer(2);
        addChoice(2, null);
    } else {
       $("#player1").html("Waiting for player");
       $("#player2").html("Waiting for player"); 
    }
});




function updateScore(id, winLoss){  //
    var wins;
    var losses;
    database.ref("/players/" + id).once("value", function(snapshot){
        wins = snapshot.val().wins;
        losses = snapshot.val().losses;
    }, function(errorObj){
        console.log("Error occured: " + errorObj.code);
    });

    if(winLoss){
        wins++;
        database.ref("/players/" + id).update({
            wins: wins,
            choice: null
        });
    } else {
        losses++;
        database.ref("/players/" + id).update({
            losses: losses,
            choice: null
        });
    }

}
function playerChoice(id){
    var choice = false;
        database.ref("/players/" + id).once("value", function(snapshot){
        if(snapshot.child("choice").exists())
            choice = snapshot.val().choice; 
    }, function(errorObj){
        console.log("Error occured: " + errorObj.code);
    });
    return choice;
}

function addChoice(id, choice){
    database.ref("/players/" + id).update({
        choice: choice
    });
}

function newPlayer(name, id){
    database.ref("/players/" + id).set({
        name: name,
        wins: 0,
        losses: 0
    });
}

function playerExists(id){
    var exists = false;
    database.ref("/players").once("value", function(snapshot){
        if(snapshot.child(id).exists())
            exists = true; 
    }, function(errorObj){
        console.log("Error occured: " + errorObj.code);
    });
    return exists;
}

function displayPlayer(id){
    var name;
    var wins;
    var losses;
    database.ref("/players/" + id).once("value", function(snapshot){
        name = snapshot.val().name;
        wins = snapshot.val().wins;
        losses = snapshot.val().losses;     
    }, function(errorObj){
        console.log("Error occured: " + errorObj.code);
    }); 

    $("#player" + id).html(name + "<br>" +
                                 "Wins: " + wins + "<br>" + 
                                 "Losses: " + losses); 
}

function playRPS(player1, player2){
    if ((player1 === "r") && (player2 === "s")) {
        return 1;
    }
    else if ((player1 === "r") && (player2 === "p")) {
        return 2;
    }
    else if ((player1 === "s") && (player2 === "r")) {
        return 2;
    }
    else if ((player1 === "s") && (player2 === "p")) {
        return 1;
    }
    else if ((player1 === "p") && (player2 === "r")) {
        return 1;
    }
    else if ((player1 === "p") && (player2 === "s")) {
        return 2;
    }
    else if (player1 === player2) {
        return 0;
    }
}

$(document).ready(function(){

    $("#submit-name").on("click", function(){
        event.preventDefault();
        if(!playerExists(1)){
            var name = $("#player-name").val().trim();
            id = 1;
            opponent = 2;
            newPlayer(name, id);
            database.ref("/players/1").onDisconnect().remove();
        } else if (!playerExists(2)){
            var name = $("#player-name").val().trim();
            id = 2;
            opponent = 1;
            newPlayer(name, id);
            database.ref("/players/2").onDisconnect().remove();
        }
    });

    $(".rps").on("click", function(){
        if(id !== undefined && madeChoice === false)
            addChoice(id, $(this).attr("data-value"));
        //console.log("reached");
    });

    $("#chat-submit").on("click", function(){
        event.preventDefault();

    })
});

