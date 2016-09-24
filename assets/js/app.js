// Initialize Firebase
var config = {
	apiKey: "AIzaSyB6x4Aln-GHP8uRwtXc5HxKVaPlw3EU3u8",
	authDomain: "rpsgame-78bfc.firebaseapp.com",
	databaseURL: "https://rpsgame-78bfc.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "252670266775"
};
firebase.initializeApp(config);

// Initialize variables
var database = firebase.database();

var firstPageLoad = true;

var playerOneName = "";
var playerOneWins = 0;
var playerOneLosses = 0;
var playerOneTies = 0;
var playerOneChoice = "not selected";
var	playerOneTrash;
var playerOneNewTrash  = "no";

var playerTwoName = "";
var playerTwoWins = 0;
var playerTwoLosses = 0;
var playerTwoTies = 0;
var playerTwoChoice = "not selected";
var	playerTwoTrash;
var	playerTwoNewTrash = "no";


var playerOnePresent = false;
var playerTwoPresent = false;
var gameInProgress = false;
var youArePlayerOne = false;
var youArePlayerTwo = false;
var snapShotData;

//Lines below set up by Dan & modified by me. Mostly Dan, though.
// create a 'players' collection on your firebase
var playersRef = database.ref("players");

// Make a constructor for a player object
function createPlayerInstance(playerNumber, playerName){
  //creates an ID based on the passed in integer
  playerRef = database.ref("/players/" + playerNumber);

  //creates player reference in db [SET used to be PUSH // trying to avoid firebase random IDs]
  playerRef.set({
    name: playerName,
    wins: 0,
    losses: 0,
    ties: 0,
    present: true
  });

  //on 'disconnect' remove the player
  playerRef.onDisconnect().remove();

}

//Submit button function
$('#submit').on('click', function() {
	if (playerOnePresent == false) {
		playerOnePresent = true;
		youArePlayerOne = true;
		playerOneName = ($('#player').val());

	    // Create player 1
	    createPlayerInstance(1, playerOneName);
		printPlayer("one", playerOneName);

	} else if (youArePlayerOne == false) {
		playerTwoPresent = true;
		youArePlayerTwo = true;
		playerTwoName = ($('#player').val());
    
	    // Create player 2
	    createPlayerInstance(2, playerTwoName);
		printPlayer("two", playerTwoName);
	}
})

database.ref().on("value", function(snapshot) {
	snapShotData = snapshot.val();
	
	if (snapshot.hasChild("players") == false) {
		return false;
	}

	//This was triggering too quickly for the DB to update...?
	    setTimeout(function () {
	    	console.log("check results after snapshot update")
	        checkResults();
	    }, 2000);
	
	//if no players are currently in a game, initialize variables.
	if (playerOnePresent == true && playerTwoPresent == true) {

		playerOneName   = snapshot.val().players[1].name;
		playerOneWins   = snapshot.val().players[1].wins;
		playerOneLosses = snapshot.val().players[1].losses;
		playerOneTies   = snapshot.val().players[1].ties;
		playerOneChoice = snapshot.val().players[1].choice;
		playerTwoName   = snapshot.val().players[2].name;
		playerTwoWins   = snapshot.val().players[2].wins;
		playerTwoLosses = snapshot.val().players[2].losses;
		playerTwoTies   = snapshot.val().players[2].ties;
		playerTwoChoice = snapshot.val().players[2].choice;
		gameInProgress  = snapshot.val().gameInProgress;
		playerOneTrash  = snapshot.val().players[1].trash;
		playerOneNewTrash  = snapshot.val().players[1].newTrash;
		playerTwoTrash  = snapshot.val().players[2].trash;
		playerTwoNewTrash  = snapshot.val().players[2].newTrash;
		printPlayer("one", playerOneName);
		printPlayer("two", playerTwoName);
	} else if (playerOnePresent == true) {
		playerOneName   = snapshot.val().players[1].name;
		playerOneWins   = snapshot.val().players[1].wins;
		playerOneLosses = snapshot.val().players[1].losses;
		playerOneTies   = snapshot.val().players[1].ties;
		playerOneChoice = snapshot.val().players[1].choice;
		playerOneTrash  = snapshot.val().players[1].trash;
		playerOneNewTrash  = snapshot.val().players[1].newTrash;
		
		printPlayer("one", playerOneName);
	} else if (playerTwoPresent == true) {
		playerTwoName   = snapshot.val().players[2].name;
		playerTwoWins   = snapshot.val().players[2].wins;
		playerTwoLosses = snapshot.val().players[2].losses;
		playerTwoTies   = snapshot.val().players[2].ties;
		playerTwoChoice = snapshot.val().players[2].choice;
		playerTwoTrash  = snapshot.val().players[2].trash;
		playerTwoNewTrash  = snapshot.val().players[2].newTrash;
		printPlayer("two", playerTwoName);
	} else {
		console.log("no one's here");
	}

	updateTrashTalker();
})

//Set up by Dan. Listen for changes on the 'players' collection
playersRef.on('value', function(snapshot) {
  //set player presence through listener
  playerOnePresent = snapshot.child('1').exists();
  playerTwoPresent = snapshot.child('2').exists();
});

//Print Player info
function printPlayer(playerPosition, playerName) {

	if (playerPosition == "one") {
		var divToUpdate = $('#playerOneInfo');
		var rockClass = "Rock";
		var paperClass = "Paper";
		var scissorsClass = "Scissors";
		var playerDivName = "playerOneChoiceOptions";
	} else {
		var divToUpdate = $('#playerTwoInfo');
		var rockClass = "Rock";
		var paperClass = "Paper";
		var scissorsClass = "Scissors";
		var playerDivName = "playerTwoChoiceOptions";
		$('#playerEntry').addClass('hidden');
		gameOn();
	}

	$('#player').val("");
	var nameString = $('<p>');
	nameString.text(playerName);

	var rock = $('<div>');
	rock.attr('data-choice', rockClass);
	rock.addClass(playerDivName);
	var options = $('<p>');
	options.text("Rock.");
	rock.append(options);

	var paper = $('<div>');
	paper.attr('data-choice', paperClass);
	paper.addClass(playerDivName);
	var options = $('<p>');
	options.text("Paper.");
	paper.append(options);

	var scissors = $('<div>');
	scissors.attr('data-choice', scissorsClass);
	scissors.addClass(playerDivName);
	var options = $('<p>');
	options.text("Scissors.");
	scissors.append(options);

	var recordString = $('<p>');
	if (playerPosition == "one") {
		recordString.text(playerOneWins + " wins, " + playerOneLosses + " losses, " + playerOneTies + " ties");
	} else {
		recordString.text(playerTwoWins + " wins, " + playerTwoLosses + " losses, " + playerTwoTies + " ties");
	}

	divToUpdate.html("");
	divToUpdate.append(nameString);
	divToUpdate.append(rock);

	divToUpdate.append(paper);
	divToUpdate.append(scissors);
	divToUpdate.append(recordString);

}

function gameOn() {
	if (gameInProgress == false) {
		gameInProgress = true;

		var introductions = $('<p>');
		introductions.text(playerOneName + " will take on " + playerTwoName + " in a game with very few consequences.")
		introductions.append("<br><br>Choose your weapons!!");

		$('#gameTrackInfo').html("");
		$('#gameTrackInfo').html(introductions);
	}
}

$(document).on('click','.playerOneChoiceOptions', function() {

		if ((playerOneChoice != "Rock" && playerOneChoice != "Paper" && playerOneChoice != "Scissors") && playerTwoPresent== true && youArePlayerOne == true)  {

			playerOneChoice = $(this).attr('data-choice');
		  	playerRef.update({
		    	choice: playerOneChoice
	  		});
	  		playerTwoChoice = snapShotData.players[2].choice;
			// checkResults();
		}
})

$(document).on('click','.playerTwoChoiceOptions', function() {
	if ((playerTwoChoice != "Rock" && playerTwoChoice != "Paper" && playerTwoChoice != "Scissors") && playerOnePresent== true && youArePlayerTwo == true) {
		playerTwoChoice = $(this).attr('data-choice');
		playerRef.update({
	    	choice: playerTwoChoice
  		});
  		playerOneChoice = snapShotData.players[1].choice;
		// checkResults();
	}
})

function checkResults() {

	//This is triggering too quickly for the DB to update...?
	// setTimeout(function () {
	//    	console.log("check results after snapshot update")
	//     checkResults();
	    
	if (playerOneChoice == "not selected" || playerTwoChoice == "not selected" || playerOneChoice == undefined || playerTwoChoice == undefined) {
		console.log("someone hasn't selected their weapon yet.");
		return false;
	} else if (playerOneChoice == playerTwoChoice) {
		playerOneTies++;
		playerTwoTies++;
		gameOverMessage("tie");
	} else if (playerOneChoice == "Rock" && playerTwoChoice != "Paper") {
		playerOneWins++;
		playerTwoLosses++;
		gameOverMessage("one");
	} else if (playerOneChoice == "Paper" && playerTwoChoice != "Scissors") {
		playerOneWins++;
		playerTwoLosses++;
		gameOverMessage("one");
	} else if (playerOneChoice == "Scissors" && playerTwoChoice != "Rock") {
		playerOneWins++;
		playerTwoLosses++;
		gameOverMessage("one");
	} else {
		playerTwoWins++;
		playerOneLosses++;
		gameOverMessage("two");
	}

	updateTrashTalker();
}

function gameOverMessage(winner) {
	var pOne = $('<p>');
	var pTwo = $('<p>');
	var victory = $('<p>');

	if (winner == "tie") {
		pOne.text(playerOneName + " throws " + playerOneChoice + ".");
		pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");
		victory.text("It's a tie!");
	} else if (winner == "one") {
		pOne.text(playerOneName + " throws " + playerOneChoice + ".");
		pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");
		victory.text(playerOneName + " wins!");
	} else if (winner =="two") {
		pOne.text(playerOneName + " throws " + playerOneChoice + ".");
		pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");
		victory.text(playerTwoName + " wins!");
	}

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(pOne);
	$('#gameTrackInfo').append(pTwo);
	$('#gameTrackInfo').append(victory);

	resetGame();
}

function resetGame() {

	console.log("resetGame called");

	var wins;
	var losses;
	var ties;

	if (youArePlayerOne==true) {
		wins = playerOneWins;
		losses = playerOneLosses;
		ties = playerOneTies;
	} else if (youArePlayerTwo==true) {
		wins = playerTwoWins;
		losses = playerTwoLosses;
		ties = playerTwoTies;
	}
	
    playerRef.update({
	    wins: wins,
	    losses: losses,
	    ties: ties,
	});

	//print updated records
	printPlayer("one", playerOneName);
	printPlayer("two", playerTwoName);

	// console.log("resetting choice variables");
	playerOneChoice = "not selected";
	playerTwoChoice = "not selected";

	database.ref("/players/1").update({
	   	choice: "not selected"
	});
	database.ref("/players/2").update({
	   	choice: "not selected"
	});

}

$(document).on('click', '#trashTalk', function() {

	if (playerOnePresent==true && playerTwoPresent==true) {

		playerRef.update({
			newTrash: "yes",
		    trash: trashTalker.value + "<br>"
		});
	}	
})

function updateTrashTalker() {
	
	var trashtalk;

	if (playerOneNewTrash == "yes") {
		trashtalk = "<span class='playerOneText'>" + playerOneName + "</span>: " + playerOneTrash + "<br>";
		database.ref("/players/1").update({
			newTrash: "no",
	    	trash: ""
		});
	} else if (playerTwoNewTrash == "yes") {
		trashtalk = "<span class='playerTwoText'>" + playerTwoName + "</span>: " + playerTwoTrash + "<br>";
		database.ref("/players/2").update({
			newTrash: "no",
	    	trash: ""
		});
	} 
	
	trashTalker.value = "";
	$('#trashBin').append(trashtalk);

}