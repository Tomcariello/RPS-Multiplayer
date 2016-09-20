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



//This is definitely wrong. One page load this is set all variables to null. Once the onDisconnect is setup to release the values when a user leaves this should be removed/adjusted.
database.ref().set({
	playerOnePresent: false,
	playerTwoPresent: false,
	gameInProgress: false,
	playerOneTies: 0,
	playerTwoTies: 0,
	playerOneWins: 0,
	playerTwoWins: 0,
	playerOneLosses: 0,
	playerTwoLosses: 0,
	gameInProgress: false
});

var youArePlayerOne = false;
var youArePlayerTwo = false;

//Submit button function
$('#submit').on('click', function() {
	
	if (playerOnePresent == false) {
		playerOnePresent = true;
		youArePlayerOne = true;
		playerOneName = ($('#player').val());
		database.ref().update({
			playerOnePresent: true,
			playerOneName: playerOneName,
		});
		
		printPlayer("one", playerOneName);
	} else if (youArePlayerOne == false) {
		playerTwoPresent = true;
		youArePlayerTwo = true;
		playerTwoName = ($('#player').val());
		database.ref().update({
			playerTwoPresent: true,
			playerTwoName: playerTwoName,
		});
		
		printPlayer("two", playerTwoName);
	}
})

database.ref().on("value", function(snapshot) {
	if (firstPageLoad == true) {
		firstPageLoad = false;
		return false;
	}

	if (snapshot.val().playerOnePresent == true) {
		playerOneName = snapshot.val().playerOneName;
		playerOnePresent = true;
		playerTwoChoice = snapshot.val().playerTwoChoice;
		playerOneChoice = snapshot.val().playerOneChoice;
		playerOneTies = snapshot.val().playerOneTies;
		playerTwoTies = snapshot.val().playerTwoTies;
		playerOneWins = snapshot.val().playerOneWins;
		playerTwoWins = snapshot.val().playerTwoWins;
		playerOneLosses = snapshot.val().playerOneLosses;
		playerTwoLosses = snapshot.val().playerTwoLosses;
		gameInProgress = snapshot.val().gameInProgress;
		printPlayer("one", snapshot.val().playerOneName);
	}

	if (snapshot.val().playerTwoPresent == true) {
		console.log("player 2 is present");
		playerTwoName = snapshot.val().playerTwoName;
		playerTwoPresent = true;
		playerOneChoice = snapshot.val().playerOneChoice;
		playerTwoChoice = snapshot.val().playerTwoChoice;
		playerOneTies = snapshot.val().playerOneTies;
		playerTwoTies = snapshot.val().playerTwoTies;
		playerOneWins = snapshot.val().playerOneWins;
		playerTwoWins = snapshot.val().playerTwoWins;
		playerOneLosses = snapshot.val().playerOneLosses;
		playerTwoLosses = snapshot.val().playerTwoLosses;
		gameInProgress = snapshot.val().gameInProgress;
		printPlayer("two", snapshot.val().playerTwoName);
		checkResults();
	}
})

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
		database.ref().update({
			gameInProgress: true
		});
		
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
		database.ref().update({
			playerOneChoice: playerOneChoice,
		});
		checkResults();
	}
})

$(document).on('click','.playerTwoChoiceOptions', function() {
	if ((playerTwoChoice != "Rock" && playerTwoChoice != "Paper" && playerTwoChoice != "Scissors") && playerOnePresent== true && youArePlayerTwo == true) {
		
		playerTwoChoice = $(this).attr('data-choice');
		database.ref().update({
			playerTwoChoice: playerTwoChoice,
		})
		checkResults();
		}
})

function checkResults() {
	console.log("Checking Results" + playerOneChoice + " " + playerTwoChoice);

	if (playerOneChoice == "" || playerTwoChoice == "") {
		console.log("someone hasn't selected their weapon yet.");
		return false;
	} else if (playerOneChoice ==  playerTwoChoice) {
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
	resetGame();
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
}

function resetGame() {
	playerOneChoice = "";
	playerTwoChoice = "";
	database.ref().update({
		playerOneTies: playerOneTies,
		playerTwoTies: playerTwoTies,
		playerOneWins: playerOneWins,
		playerTwoWins: playerTwoWins,
		playerOneLosses: playerOneLosses,
		playerTwoLosses: playerTwoLosses,
		playerOneChoice: playerOneChoice,
		playerTwoChoice: playerTwoChoice
	});
	printPlayer("one", playerOneName);
	printPlayer("two", playerTwoName);
}

$(document).on('click', '#trashTalk', function() {
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
})



//Create presence system to track the number of users. This only sees 1 user at a time. If I open a second session it drops the count to 0 and then increments back to 1. I have no idea what the code below is doing & pulled he code from SO & can't figure it out.

var listRef = new Firebase("https://rpsgame-78bfc.firebaseio.com/presence/");
userRef = listRef.push();
// Add ourselves to presence list when online.
var presenceRef = new Firebase("https://rpsgame-78bfc.firebaseio.com/.info/connected");

presenceRef.on("value", function(snap) {
  if (snap.val()) {
    // Remove ourselves when we disconnect.
    userRef.onDisconnect().remove();
    userRef.set(true);
  }
});

// Number of online users is the number of objects in the presence list.
listRef.on("value", function(snap) {
  console.log("# of online users = " + snap.numChildren());
});    