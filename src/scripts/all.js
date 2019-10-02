import changeSubs from '../scripts/changeSubs';
import correctDeck from '../scripts/correctDecks';
import notesAddLoop from '../scripts/notesAddLoop';

import path from 'path';

const test = () => {
    console.log('ttttest');
    const text = '僕の私語多は難しかったので、やんでいた。';

    console.log(text);
}

const cliScripts = {
    '00change': changeSubs,
    // 'correct-decks': correctDeck, // hide it b/c i'm not using it now
    'notes-add-loop': notesAddLoop,
    'test': test
}

export default cliScripts;
