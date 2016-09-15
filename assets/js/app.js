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

	$('#player').val("");
	var nameString = $('<p>');
	nameString.text(playerName);

	var options = $('<p>');
	options.text("Rock. Paper. Scissors.");

	var recordString = $('<p>');
	recordString.text("0 wins, 0 losses, 0 ties");

	if (playerPosition == "one") {
		$('#playerOneInfo').html("");
		$('#playerOneInfo').append(nameString);
		$('#playerOneInfo').append(options);
		$('#playerOneInfo').append(recordString);
	} else {
		$('#playerTwoInfo').html("");
		$('#playerTwoInfo').append(nameString);
		$('#playerTwoInfo').append(options);
		$('#playerTwoInfo').append(recordString);
		gameOn();
	}
}
		
function gameOn() {
	var introductions = $('<p>');
	introductions.text(playerOneName + " will take on " + playerTwoName + " in a game with very few consequences.")
	introductions.append("<br><br>Choose your weapons!!");

	$('#gameTrackInfo').html("");
	$('#gameTrackInfo').html(introductions);


}
