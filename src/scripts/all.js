import changeSubs from '../scripts/changeSubs';
import correctDeck from '../scripts/correctDecks';
import notesAddLoop from '../scripts/notesAddLoop';

import kuromoji from 'kuromoji';

const test = () => {
    console.log('ttttest');
    const text = '僕の私語多は難しかったので、やんでいた。';

    console.log(text);

    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build(function (err, tokenizer) {
        // tokenizer is ready
        var path = tokenizer.tokenize(text);
        console.log(path);
    });
}

const cliScripts = {
    '00change': changeSubs,
    // 'correct-decks': correctDeck, // hide it b/c i'm not using it now
    'notes-add-loop': notesAddLoop,
    'test': test
}

export default cliScripts;
