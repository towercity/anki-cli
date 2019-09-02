import Anki from '../services/Anki';
import DECK_IDS from '../data/deck_ids';

import logResult from '../scripts/logResult';

const searchTerms = {
    toListening: '"note:Japanese" (card:3 OR card:4 or card:5 OR card:6 or card:7 or card:8 or card:9) -deck:"* Listening"',
    toOther: '"note:Japanese" (card:1 OR card:2) -deck:"*Other"'
}

const moveDecks = (searchString, newDeck) => {
    Anki
        .findCards(searchString)
        .then(res => {
            logResult(
                `found ${res.length} cards to move to ${newDeck}`,
                'moving...'
            );

            Anki
                .changeDecks(res, newDeck)
                .then(res => {
                    logResult(`cards moved`);
                })
        })
}

const correctDeck = () => {
    logResult('searching for misplaced cards...');

    moveDecks(searchTerms.toListening, DECK_IDS.listening);
    moveDecks(searchTerms.toOther, DECK_IDS.other);
}

export default correctDeck;