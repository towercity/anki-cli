import changeSubs from '../scripts/changeSubs';
import correctDeck from '../scripts/correctDecks';
import notesAddLoop from '../scripts/notesAddLoop';

const cliScripts = {
    '00change': changeSubs,
    // 'correct-decks': correctDeck, // hide it b/c i'm not using it now
    'notes-add-loop': notesAddLoop
}

export default cliScripts;