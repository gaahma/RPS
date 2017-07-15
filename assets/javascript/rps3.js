var id;
var myName;

var opponent;
var opponentName;

var isPlayer = false;

var chatStarted = false;
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


database.ref("/players").on("value", function(snapshot){
    var player1 = snapshot.child("1").exists();
    var player2 = snapshot.child("2").exists();
    if(player1 && player2){
        if(opponentName === undefined){
            opponentName = getName(opponent);
        }
        var myChoice = playerChoice(id);
        var oppChoice = playerChoice(opponent);
        if(myChoice && oppChoice){
            $("#player" + id).html("<h3>" + humanize(myChoice) + "</h3");
            $("#player" + opponent).html("<h3>" + humanize(oppChoice) + "</h3");
            var winner = playRPS(myChoice, oppChoice);
            if(winner === 1){  //1 if I win
                if(id === 1){   //only player1 updates the win/loss info
                    setTimeout(function(){
                        updateScore(id, 1);
                        updateScore(opponent,0);
                    }, 1500);
                }
                $("#mediator").html("You won!");
            } 
            else if(winner === 2){ //2 if my opponent wins
                if (id === 1){  //only player 1 updates the win/loss info.  
                    setTimeout(function(){
                        updateScore(id, 0);
                        updateScore(opponent,1);
                    }, 1500);
                }
                $("#mediator").html("You lost!");
            } else {                //0 (else) if a tie
                $("#mediator").html("Tie!");
                if(id === 1){
                    setTimeout(function(){
                        addChoice(id, null); 
                        addChoice(opponent, null);
                    }, 1500);
                }
            }
        } 
        else if (myChoice){
            $("#mediator").html("Waiting for opponent to pick");
        } 
        else if (oppChoice){
            $("#mediator").html("Waiting for you to pick");
        } else {
            displayPlayer(1);
            displayPlayer(2);
            $('#mediator').html("Waiting for both players to choose");
        }
    }
    else if(player1){
        $("#player2").html("Waiting for player");
        $("#mediator").empty();
        if(opponentName !== undefined){
            $("#chat").append(opponentName + " has disconnected\n");
            opponentName = undefined;
        }
        displayPlayer(1);
        opponent = 2;
        addChoice(1, null);
    } 
    else if(player2){
        $("#player1").html("Waiting for player");
        $("#mediator").empty();
        if(opponentName !== undefined){
            $("#chat").append(opponentName + " has disconnected\n");
            opponentName = undefined;
        }
        displayPlayer(2);
        opponent = 1;
        addChoice(2, null);
    } else {
        $("#mediator").html("Type your name to join");
        $("#player1").html("Waiting for player");
        $("#player2").html("Waiting for player"); 
    }
});

chatReset();

function humanize(choice){
    if (choice === "r")
        return "Rock";
    if (choice === "p")
        return "Paper";
    if (choice === "s")
        return "Scissors";
}

function chatReset(){
    database.ref().once("value", function(snapshot){
        if(snapshot.child("chat").exists){
            if(id === undefined && opponent === undefined){
                database.ref("/chat").remove();
                $("#chat").empty();
            }
            else if(isPlayer === false){
                $("#chat").empty();
            }         
        }
    }, function(errorObj){
        console.log(errorObj.code);
    });

    database.ref("/chat").on("child_added", function(snapshot){
        $("#chat").append(snapshot.val().message + "\n");
    }, function(errorObj){
        console.log(errorObj.code);
    });
}

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

function getName(id){
    var name;
    database.ref("/players/" + id).once("value", function(snapshot){
        name = snapshot.val().name;
    }, function(errorObj){
        console.log(errorObj.code);
    });
    return name;
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
            myName = $("#player-name").val().trim();
            id = 1;
            opponent = 2;
            newPlayer(myName, id);
            $("#add-player").hide();
            database.ref("/players/1").onDisconnect().remove();
            isPlayer = true;
        } else if (!playerExists(2)){
            myName = $("#player-name").val().trim();
            id = 2;
            opponent = 1;
            newPlayer(myName, id);
            $("#add-player").hide();
            isPlayer = true;
            database.ref("/players/2").onDisconnect().remove();
        }
        $("#player-name").val("");
    });

    $(".rps").on("click", function(){
        if(isPlayer === false)
            return;
        addChoice(id, $(this).attr("data-value"));     
        
    });

    $("#chat-submit").on("click", function(){
        event.preventDefault();
        if(id === undefined)
            return;
        var message = $("#chat-input").val().trim();
        database.ref("/chat").push({
            message: myName + ": " + message,
        });
        $("#chat-input").val("");
    });
});

