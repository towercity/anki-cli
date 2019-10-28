# anki-cli #

`anki-cli` is a simple nodejs based command line interface for Anki. It runs a few basic deck management scripts now, with plans to add more. Best of all, it's easily extensible, so adding your own scripts is a cinch.

<!-- vscode-markdown-toc -->
* [Installation ##](#Installation)
* [Use ##](#Use)
* [Scripts ##](#Scripts)
	* [00change ###](#change)
	* [correct-decks (not currently active) ###](#correct-decksnotcurrentlyactive)
	* [notes-add-loop](#notes-add-loop)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='Installation'></a>Installation ##

1. Download or clone the repository to your harddrive
2. Run `npm install` to install dependencies
3. Run `npm link` to install the scripts globally to your machine

## <a name='Use'></a>Use ##

1. Run `anki-cli` from the command line
2. Select the script you'd like to run from the list
3. You can also run your script from the comman line by adding it to the end of your `anki-cli` call

__Notes:__ 

* `anki-cli` requires the AnkiConnect Anki plugin to function. You can read more about AnkiConnect and download it [here](https://ankiweb.net/shared/info/2055492159)
* As it's written now, `anki-cli` is designed around Japanese learning, and assumes you use my [Adaptive Vobabulary Flashcards Template](https://github.com/towercity/anki-adaptive-vobabulary-flashcards), or a variation of it. Feel free to fork the repository to change this tho. Comments are plentiful
* `anki-cli` also assumes you have your decks organized like mine, but that's a much simpler fix: navigate to `scr/data/deck_ids` in the code or text editor of your choice, and change the deck names there to your current deck names of choice

## <a name='Scripts'></a>Scripts ##

### <a name='change'></a>00change ###

`00change` takes 2srs cards and turns them vocabulary review cards. To use:

1. Copy the vocab word you'd like to study into the 'note' field of your subs2srs card
2. tag the card '00change'
3. run `anki-cli 00change` in the command line

The script will automatically change the subs2srs card into a vocab card and move it into the proper deck (selcted in `scr/data/deck_ids`). It can handle any number of changes in one call, so it helps to have a lot built up.

### <a name='correct-decksnotcurrentlyactive'></a>correct-decks (not currently active) ###

My [Adaptive Vobabulary Flashcards Template](https://github.com/towercity/anki-adaptive-vobabulary-flashcards) requires your listening cards to be saved into a separate deck to function properly. This script moves misplaced cards into thier proper decks (selcted in `scr/data/deck_ids`). Simply run and done: `anki-cli correct-decks`.

### <a name='notes-add-loop'></a>notes-add-loop

My main reason for building this program: `notes-add-loop` is a quick and easy (therefore entirely imperfect) little script that lets you search jisho for the meanings of Japanese terms and add them to your Anki database.

In essence, this is an all-in-one reading practice app, stripped to its barest bits. You select a tag you'd like to add cards to -- I use the name of whatever game/book/article I'm reading here, for easy filtered decks later -- then the script will continually prompt you for new words to search the meanings of, until you tell it to quit, that is. It will display the word you've searched with its definition, then prompt if you'd like to add the card to your Anki database or not.

If you select yes, the script will search for the term in your database. If a noot already exists, it will add the tag you've selected to the note than continue the loop. If the card doesn't exist, it will then search your subs2srs cards for any notes that uses the term (with some very basic conjugation allowances), add the tag you've selected to the card, convert the card to a standard Vocabulary card, then continue the loop. (Note: see above for how the script uses subs2srs -- the script uses the `00change` script for this functionality.) Finally, if none of these methods find any notes, the script will create a new card for the term with the tag you've chosen. It'll also tell you how many notes you've added so far. Why? I don;t know, I guess it just helps you feel accomplished.

A call to `notes-add-loop` looks like this:

```
anki-cli notes-add-loop tag-to-add
```

The rest is explained by the script as it runs, but feel free to suggest edits to the README if you think this needs more clarity.
 