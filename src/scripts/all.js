import changeSubs from '../scripts/changeSubs';
import correctDeck from '../scripts/correctDecks';
import notesAddLoop from '../scripts/notesAddLoop';

import Anki from '../services/Anki';

const test = () => {
    console.log('ttttest');
    const text = '僕の私語多は難しかったので、やんでいた。';

    const temp_id = [1339252521447];
    // Anki.addTags('00change review', temp_id);

    console.log(text);
}

const cliScripts = {
    '00change': changeSubs,
    // 'correct-decks': correctDeck, // hide it b/c i'm not using it now
    'notes-add-loop': notesAddLoop,
    'test': test
}

export default cliScripts;
