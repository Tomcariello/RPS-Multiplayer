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

var playerOneName = "";
var playerOneWins = "";
var playerOneLosses = "";
var playerOneTies = "";
var playerOneRock = "";
var playerOnePaper = "";
var playerOneScissors = "";

var playerTwoName = "";
var playerTwoWins = "";
var playerTwoLosses = "";
var playerTwoTies = "";
var playerTwoRock = "";
var playerTwoPaper = "";
var playerTwoScissors = "";

var playerOnePresent = false;
var playerTwoPresent = false;




$('#submit').on('click', function() {
	
	if (playerOnePresent == false) {
		playerOnePresent = true;
		playerOneName = ($('#player').val());
		printPlayer("one", playerOneName);
	} else {
		playerTwoPresent = true;
		playerTwoName = ($('#player').val());
		printPlayer("two", playerTwoName);
	}
})
		
function printPlayer(playerPosition, playerName) {

	if (playerPosition == "one") {
		var divToUpdate = $('#playerOneInfo');
		var rockClass = "p1Rock";
		var paperClass = "p1Paper";
		var scissorsClass = "p1Scissors";
	} else {
		var divToUpdate = $('#playerTwoInfo');
		var rockClass = "p2Rock";
		var paperClass = "p2Paper";
		var scissorsClass = "p2Scissors";
	}


	$('#player').val("");
	var nameString = $('<p>');
	nameString.text(playerName);

	var rock = $('<div>');
	rock.addClass(rockClass);
	var options = $('<p>');
	options.text("Rock.");
	rock.append(options);

	var paper = $('<div>');
	paper.addClass(paperClass);
	var options = $('<p>');
	options.text("Paper.");
	paper.append(options);

	var scissors = $('<div>');
	scissors.addClass(scissorsClass);
	var options = $('<p>');
	options.text("Scissors.");
	scissors.append(options);

	var recordString = $('<p>');
	recordString.text("0 wins, 0 losses, 0 ties");


	divToUpdate.html("");
	divToUpdate.append(nameString);
	divToUpdate.append(rock);

	divToUpdate.append(paper);
	divToUpdate.append(scissors);
	divToUpdate.append(recordString);
	gameOn();
}
		
function gameOn() {
	var introductions = $('<p>');
	introductions.text(playerOneName + " will take on " + playerTwoName + " in a game with very few consequences.")
	introductions.append("<br><br>Choose your weapons!!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(introductions);
}

$(document).on('click','.p1Rock', function() {
	console.log($(this));
})