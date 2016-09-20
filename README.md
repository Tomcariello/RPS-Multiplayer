# RPS-Multiplayer

9/15/2016
Create RPS html layout
Create naming system and insert values onto game board
Added firebase information to documents (not hooked up yet)

9/17/2016
Track wins/losses
Add chat feature
Create game logic (or copy from previous exercise)
Allow player 1 to select their move, then alert player 2 to select their move. (I'll allow both players to select whenever they want)

9/18/2016
Core gameplay is in place.
Add firebase connectivity
Only Player One is allowed to select the player one move and vice versa.
Once player enters their name the "enter name" box should disappear (this is disabled but not hidden)

9/19/2016
Games are now in sync.
Fixed "gameTracker" box to display messages universally
Added functions for player wins.
Updated firebase calls throughout program to ref().update instead of ref().set.

9/20/2016
Added firebase presence but it is not working as intended
Fixed up chat window
	Indicate in trashtalker which player talked which trash.
	In trashtalker, insert lines breaks. (This is trivial if I replace the textarea element with a standard div).




To Do List
If player 1 is already assigned when the player 2 page loads it is not aware of player one.
On disconnect, clear all variables from firebase DB




Stretch Goals
Add graphics for Rock/Paper/Scissors
Add funny/interesting game commentary
Add background image to liven things up
Add random comments to the chat feature
End of game transitions