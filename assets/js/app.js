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

database.ref().set({
	playerOnePresent: false,
	playerTwoPresent: false,
	playerOneTies: 0,
	playerTwoTies: 0,
	playerOneWins: 0,
	playerTwoWins: 0,
	playerOneLosses: 0,
	playerTwoLosses: 0

});

var youArePlayerOne = false;
var youArePlayerTwo = false;

//Submit button function
$('#submit').on('click', function() {
	
	if (playerOnePresent == false) {
		playerOnePresent = true;
		youArePlayerOne = true;
		playerOneName = ($('#player').val());
		database.ref().set({
			playerOnePresent: true,
			playerOneName: playerOneName,
			playerOneTies: playerOneTies,
			playerTwoTies: playerTwoTies,
			playerOneWins: playerOneWins,
			playerTwoWins: playerTwoWins,
			playerOneLosses: playerOneLosses,
			playerTwoLosses: playerTwoLosses
		});
		
		printPlayer("one", playerOneName);
	} else if (youArePlayerOne == false) {
		playerTwoPresent = true;
		youArePlayerTwo = true;
		playerTwoName = ($('#player').val());
		database.ref().set({
			playerOnePresent: true,
			playerTwoPresent: true,
			playerOneName: playerOneName,
			playerTwoName: playerTwoName,
			playerOneTies: playerOneTies,
			playerTwoTies: playerTwoTies,
			playerOneWins: playerOneWins,
			playerTwoWins: playerTwoWins,
			playerOneLosses: playerOneLosses,
			playerTwoLosses: playerTwoLosses
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
		printPlayer("one", snapshot.val().playerOneName);
		playerOneTies = snapshot.val().playerOneTies;
		playerTwoTies = snapshot.val().playerTwoTies;
		playerOneWins = snapshot.val().playerOneWins;
		playerTwoWins = snapshot.val().playerTwoWins;
		playerOneLosses = snapshot.val().playerOneLosses;
		playerTwoLosses = snapshot.val().playerTwoLosses;


	}

	if (snapshot.val().playerTwoPresent == true) {
		playerTwoName = snapshot.val().playerTwoName;
		playerTwoPresent = true;
		playerOneChoice = snapshot.val().playerOneChoice;
		playerTwoChoice = snapshot.val().playerTwoChoice;
		printPlayer("two", snapshot.val().playerTwoName);
		playerOneTies = snapshot.val().playerOneTies;
		playerTwoTies = snapshot.val().playerTwoTies;
		playerOneWins = snapshot.val().playerOneWins;
		playerTwoWins = snapshot.val().playerTwoWins;
		playerOneLosses = snapshot.val().playerOneLosses;
		playerTwoLosses = snapshot.val().playerTwoLosses;
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
	var introductions = $('<p>');
	introductions.text(playerOneName + " will take on " + playerTwoName + " in a game with very few consequences.")
	introductions.append("<br><br>Choose your weapons!!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(introductions);
}

$(document).on('click','.playerOneChoiceOptions', function() {

	if ((playerOneChoice != "Rock" && playerOneChoice != "Paper" && playerOneChoice != "Scissors") && playerTwoPresent== true && youArePlayerOne == true)  {
		
		playerOneChoice = $(this).attr('data-choice');
		
		if (playerTwoChoice == "Rock" || playerTwoChoice == "Paper" || playerTwoChoice == "Scissors") {
			database.ref().set({
				playerOnePresent: true,
				playerTwoPresent: true,
				playerOneName: playerOneName,
				playerTwoName: playerTwoName,
				playerOneChoice: playerOneChoice,
				playerTwoChoice: playerTwoChoice, //only send this if not null
				playerOneTies: playerOneTies,
				playerTwoTies: playerTwoTies,
				playerOneWins: playerOneWins,
				playerTwoWins: playerTwoWins,
				playerOneLosses: playerOneLosses,
				playerTwoLosses: playerTwoLosses
			});
			checkResults();
		} else {
			database.ref().set({
				playerOnePresent: true,
				playerTwoPresent: true,
				playerOneName: playerOneName,
				playerTwoName: playerTwoName,
				playerOneChoice: playerOneChoice,
				playerOneTies: playerOneTies,
				playerTwoTies: playerTwoTies,
				playerOneWins: playerOneWins,
				playerTwoWins: playerTwoWins,
				playerOneLosses: playerOneLosses,
				playerTwoLosses: playerTwoLosses
			});
		}
	}
})

$(document).on('click','.playerTwoChoiceOptions', function() {
	if ((playerTwoChoice != "Rock" && playerTwoChoice != "Paper" && playerTwoChoice != "Scissors") && playerOnePresent== true && youArePlayerTwo == true) {
		
		playerTwoChoice = $(this).attr('data-choice');
		
		if (playerOneChoice == "Rock" || playerOneChoice == "Paper" || playerOneChoice == "Scissors") {
			playerOneChoice == 
			database.ref().set({
				playerOnePresent: true,
				playerTwoPresent: true,
				playerOneName: playerOneName,
				playerTwoName: playerTwoName,
				playerOneChoice: playerOneChoice, //only send this if not null
				playerTwoChoice: playerTwoChoice,
				playerOneTies: playerOneTies,
				playerTwoTies: playerTwoTies,
				playerOneWins: playerOneWins,
				playerTwoWins: playerTwoWins,
				playerOneLosses: playerOneLosses,
				playerTwoLosses: playerTwoLosses
			});
			checkResults();
		} else {
			database.ref().set({
				playerOnePresent: true,
				playerTwoPresent: true,
				playerOneName: playerOneName,
				playerTwoName: playerTwoName,
				playerTwoChoice: playerTwoChoice,
				playerOneTies: playerOneTies,
				playerTwoTies: playerTwoTies,
				playerOneWins: playerOneWins,
				playerTwoWins: playerTwoWins,
				playerOneLosses: playerOneLosses,
				playerTwoLosses: playerTwoLosses
			});
		}
	}
})

function checkResults() {
	console.log("Checking Results" + playerOneChoice + " " + playerTwoChoice);
	if (playerOneChoice == "" || playerTwoChoice == "") {
		console.log("someone hasn't selected their weapon yet.");
		return false;
	} else if (playerOneChoice ==  playerTwoChoice) {
		// playerOneTies = database.ref().val().playerOneTies;
		// playerTwoTies = database.ref().val().playerTwoTies;
		playerOneTies++;
		playerTwoTies++;
		alert("It's a tie!");
	} else if (playerOneChoice == "Rock" && playerTwoChoice != "Paper") {
		playerOneWins++;
		alert(playerOneName + " wins!");
	} else if (playerOneChoice == "Paper" && playerTwoChoice != "Scissors") {
		playerOneWins++;
		alert(playerOneName + " wins!");
	} else if (playerOneChoice == "Scissors" && playerTwoChoice != "Rock") {
		playerOneWins++;
		alert(playerOneName + " wins!");
	} else {
		playerTwoWins++;
		alert(playerTwoName + " wins!");
	}
	resetGame();
}

function resetGame() {
	playerOneChoice = "";
	playerTwoChoice = "";
	database.ref().set({
		playerOnePresent: true,
		playerTwoPresent: true,
		playerOneName: playerOneName,
		playerTwoName: playerTwoName,
		playerOneTies: playerOneTies,
		playerTwoTies: playerTwoTies,
		playerOneWins: playerOneWins,
		playerTwoWins: playerTwoWins,
		playerOneLosses: playerOneLosses,
		playerTwoLosses: playerTwoLosses
	});
	printPlayer("one", playerOneName);
	printPlayer("two", playerTwoName);
}

$(document).on('click', '#trashTalk', function() {
	var trashtalk = trashTalker.value;
	trashTalker.value = "";
	trashBin.value +=  trashtalk;
})
