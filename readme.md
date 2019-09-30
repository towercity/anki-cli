# anki-cli #

`anki-cli` is a simple nodejs based command line interface for Anki. It runs a few basic deck management scripts now, with plans to add more. Best of all, it's easily extensible, so adding your own scripts is a cinch.

## Installation ##

1. Download or clone the repository to your harddrive
2. Run `npm install` to install dependencies
3. Run `npm link` to install the scripts globally to your machine

## Use ##

1. Run `anki-cli` from the command line
2. Select the script you'd like to run from the list
3. You can also run your script from the comman line by adding it to the end of your `anki-cli` call

__Notes:__ 

* `anki-cli` requires the AnkiConnect Anki plugin to function. You can read more about AnkiConnect and download it [here](https://ankiweb.net/shared/info/2055492159)
* As it's written now, `anki-cli` is designed around Japanese learning, and assumes you use my [Adaptive Vobabulary Flashcards Template](https://github.com/towercity/anki-adaptive-vobabulary-flashcards), or a variation of it. Feel free to fork the repository to change this tho. Comments are plentiful
* `anki-cli` also assumes you have your decks organized like mine, but that's a much simplet fix: navigate to `scr/data/deck_ids` in the code or text editor of your choice, and change the deck names thier to your current deck names of choice

## Scripts ##

### 00change ###

`00change` takes subs2srs cards and turns them vocabulary review cards. To use:

1. Copy the vocab word you'd like to study into the 'note' field of your subs2srs card
2. tag the card '00change'
3. run `anki-cli 00change` in the command line

The script will automatically change the subs2srs card into a vocab card and move it into the proper deck (selcted in `scr/data/deck_ids`). It can handle any number of changes in one call, so it helps to have a lot built up.

### correct-decks (not currently active) ###

My [Adaptive Vobabulary Flashcards Template](https://github.com/towercity/anki-adaptive-vobabulary-flashcards) requires your listening cards to be saved into a separate deck to function properly. This script moves misplaced cards into thier proper decks (selcted in `scr/data/deck_ids`). Simply run and done: `anki-cli correct-decks`.