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
var playerOneChoice = "";

var playerTwoName = "";
var playerTwoWins = 0;
var playerTwoLosses = 0;
var playerTwoTies = 0;
var playerTwoChoice = "";

var playerOnePresent = false;
var playerTwoPresent = false;
var gameInProgress = false;
var youArePlayerOne = false;
var youArePlayerTwo = false;

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
		// database.ref().update({
		// 	playerOnePresent: true
		// });
    
	    // Create player 1
	    createPlayerInstance(1, playerOneName);
		
		printPlayer("one", playerOneName);

	} else if (youArePlayerOne == false) {
		playerTwoPresent = true;
		youArePlayerTwo = true;
		playerTwoName = ($('#player').val());
		// database.ref().update({
		// 	playerTwoPresent: true
		// });
    
	    // Create player 2
	    createPlayerInstance(2, playerTwoName);
		
		printPlayer("two", playerTwoName);
	}
})

database.ref().on("value", function(snapshot) {
	var data = snapshot.val();
	
	if (snapshot.hasChild("players") == false) {
		return false;
	}

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
		printPlayer("one", playerOneName);
		printPlayer("two", playerTwoName);
		checkResults();
	} else if (playerOnePresent == true) {
		playerOneName   = snapshot.val().players[1].name;
		playerOneWins   = snapshot.val().players[1].wins;
		playerOneLosses = snapshot.val().players[1].losses;
		playerOneTies   = snapshot.val().players[1].ties;
		playerOneChoice = snapshot.val().players[1].choice;
		printPlayer("one", playerOneName);
	} else if (playerTwoPresent == true) {
		playerTwoName   = snapshot.val().players[2].name;
		playerTwoWins   = snapshot.val().players[2].wins;
		playerTwoLosses = snapshot.val().players[2].losses;
		playerTwoTies   = snapshot.val().players[2].ties;
		playerTwoChoice = snapshot.val().players[2].choice;
		printPlayer("two", playerTwoName);
	} else {
		console.log("no one's here");
	}
})


//Set up by Dan.
//listen for changes on the 'players' collection
playersRef.on('value', function(snapshot) {
  //set player presence through listener
  playerOnePresent = snapshot.child('1').exists();
  
  // if(playerOnePresent) console.log('Player One Ready');
  
  playerTwoPresent = snapshot.child('2').exists();
  
  // if(playerTwoPresent) console.log('Player Two Ready');
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
		// database.ref().update({
		// 	gameInProgress: true
		// });

		var introductions = $('<p>');
		introductions.text(playerOneName + " will take on " + playerTwoName + " in a game with very few consequences.")
		introductions.append("<br><br>Choose your weapons!!");

		$('#gameTrackInfo').html("");
		$('#gameTrackInfo').html(introductions);
	}
}

$(document).on('click','.playerOneChoiceOptions', function() {

	if (playerTwoPresent == true && playerTwoPresent ==true) {
		if ((playerOneChoice != "Rock" && playerOneChoice != "Paper" && playerOneChoice != "Scissors") && playerTwoPresent== true && youArePlayerOne == true)  {

			playerOneChoice = $(this).attr('data-choice');
		  	playerRef.update({
		    	choice: playerOneChoice
	  		});
			checkResults();
		}
	}
})

$(document).on('click','.playerTwoChoiceOptions', function() {
	if (playerTwoPresent == true && playerTwoPresent ==true) {
		if ((playerTwoChoice != "Rock" && playerTwoChoice != "Paper" && playerTwoChoice != "Scissors") && playerOnePresent== true && youArePlayerTwo == true) {

			playerTwoChoice = $(this).attr('data-choice');
			playerRef.update({
		    	choice: playerTwoChoice
	  		});
			checkResults();
			}
		}
})

function checkResults() {
	console.log("Checking Results" + playerOneChoice + " " + playerTwoChoice);

	if (playerOneChoice == undefined || playerTwoChoice == undefined) {
		console.log("someone hasn't selected their weapon yet.");
		return false;
	} else if (playerOneChoice == playerTwoChoice) {
		playerOneTies++;
		playerTwoTies++;
		tieGame();
	} else if (playerOneChoice == "Rock" && playerTwoChoice != "Paper") {
		playerOneWins++;
		playerTwoLosses++;
		playerOneWinMessage();
	} else if (playerOneChoice == "Paper" && playerTwoChoice != "Scissors") {
		playerOneWins++;
		playerTwoLosses++;
		playerOneWinMessage();
	} else if (playerOneChoice == "Scissors" && playerTwoChoice != "Rock") {
		playerOneWins++;
		playerTwoLosses++;
		playerOneWinMessage();
	} else {
		playerTwoWins++;
		playerOneLosses++;
		playerTwoWinMessage();
	}
}

function playerOneWinMessage() {
	var pOne = $('<p>');
	pOne.text(playerOneName + " throws " + playerOneChoice + ".");

	var pTwo = $('<p>');
	pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");

	var victory = $('<p>');
	victory.text(playerOneName + " wins!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(pOne);
	$('#gameTrackInfo').append(pTwo);
	$('#gameTrackInfo').append(victory);
	resetGame();
}

function playerTwoWinMessage() {
	var pOne = $('<p>');
	pOne.text(playerOneName + " throws " + playerOneChoice + ".");

	var pTwo = $('<p>');
	pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");

	var victory = $('<p>');
	victory.text(playerTwoName + " wins!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(pOne);
	$('#gameTrackInfo').append(pTwo);
	$('#gameTrackInfo').append(victory);
	resetGame();
}

function tieGame() {
	var pOne = $('<p>');
	pOne.text(playerOneName + " throws " + playerOneChoice + ".");

	var pTwo = $('<p>');
	pTwo.text(playerTwoName + " throws " + playerTwoChoice + ".");

	var victory = $('<p>');
	victory.text("It's a tie!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(pOne);
	$('#gameTrackInfo').append(pTwo);
	$('#gameTrackInfo').append(victory);
	resetGame();
}

function resetGame() {
	playerOneChoice = undefined;
	playerTwoChoice = undefined;
	printPlayer("one", playerOneName);
	printPlayer("two", playerTwoName);
}

$(document).on('click', '#trashTalk', function() {
	updateTrashTalker();
})

function updateTrashTalker() {
	var trashtalk = "";

	if (youArePlayerOne) {
		trashtalk = "<span class='playerOneText'>" + playerOneName + ": " + trashTalker.value + "<br>";
	} else if (youArePlayerTwo) {
		trashtalk = "<span class='playerTwoText'>" + playerTwoName + ": " + trashTalker.value + "<br>";
	} else {
		trashtalk = "<span class='guest'>Guest: " + trashTalker.value + "<br>";
	}
	
	trashTalker.value = "";
	$('#trashBin').append(trashtalk);

}