// This script runs through your saved decks and searches for subs2srs cards tagged as '00change' then
// creates new standard Japanese cards and autofills the information. It then moves these cards to their
// proper decks (listening or not) thru an external script and deletes the original subs2srs cards

import Anki from '../services/Anki';
import DECK_IDS from '../data/deck_ids';
import MODELS from '../data/models';
import jishoApi from 'unofficial-jisho-api';

import logResult from '../scripts/logResult';
import correctDecks from '../scripts/correctDecks';

const jisho = new jishoApi();

// const dummyNotes = [{
//     "deckName": DECK_IDS.subs,
//     "modelName": MODELS.japanese,
//     "fields": {
//         "Vocabulary": 'test',
//         "Vocabulary-Reading": 'test',
//         "Meaning": 'test',
//         "Sentence-1": 'test',
//         "Sentence-1-Reading": 'test',
//         "Sentence-1-English": 'test',
//         "Sentence-1-Audio": '',
//         "Sentence-1-Image": ''
//     },
//     tags: ['00change', 'marked']
// }]

const changeSubs = () => {
    logResult('syncing notes...')
    Anki.sync();

    logResult('running function...');

    logResult('gathering notes...');
    Anki
        // searches Anki for all new cards tagged 00change
        .findNotes('tag:00change is:new')
        // save the found notes to nodeIds array
        .then(res => {
            const noteIds = res;
            if(noteIds.length === 0) {
                logResult('no notes found', 'ending function', '');
                return;
            }
            logResult(`${noteIds.length} notes gathered`, 'pulling notes information...');

            // searches Anki for the notes info then adds new notes with the proper values
            Anki
            .notesInfo(noteIds)
            .then(res => {
                logResult('information pulled', 'creating new notes...')

                const newNotes = [];

                res.forEach(note => {
                    jisho 
                        .searchForPhrase(note.fields.Note.value)
                        .then(res => {
                            const jishoRes = res.data[0];

                            // Create a new array for tags w/o the 00change/01change tag
                            const newTags = note.tags.filter(tag => tag !== '00change' && tag!== '01change');

                            // Adds a reading if one exists
                            const reading = jishoRes.japanese[0].word 
                                ? `${note.fields.Note.value}[${jishoRes.japanese[0].reading}]` 
                                : '';
                            
                            // Turns the defintion array into a string
                            // Get an array of strings for each sub-definition
                            const subdefs = res.data[0].senses.map((sense) => {
                                return sense.english_definitions.join(', ');
                            })

                            // Join the sub-definitions into one long string
                            const meaning = subdefs.join('; ');

                            const newNote = {
                                "deckName": DECK_IDS.main,
                                "modelName": MODELS.japanese,
                                "fields": {
                                    "Vocabulary": note.fields.Note.value,
                                    "Vocabulary-Reading": reading,
                                    "Meaning": meaning,
                                    "Sentence-1": note.fields.Sentence.value,
                                    "Sentence-1-Reading": note.fields["Sentence-Reading"].value,
                                    "Sentence-1-English": note.fields.English.value,
                                    "Sentence-1-Audio": note.fields.Audio.value,
                                    // "Sentence-1-Image": note.fields.Image.value
                                },
                                tags: newTags
                            }

                            logResult(
                                '...',
                                `new note`,
                                `term: ${newNote.fields.Vocabulary}`,
                                `meaning: ${newNote.fields.Meaning}`,
                                `sentence: ${newNote.fields['Sentence-1']}`,
                                `english: ${newNote.fields['Sentence-1-English']}`,
                                `tags: ${newNote.tags.join(', ')}`
                            )

                            newNotes.push(newNote);
                        }).then((res) => {
                            // test if this is last time function is run by testing if the new notes array 
                            // is as long as the array of note IDs 
                            if(newNotes.length === noteIds.length) {
                                logResult(
                                    '...',
                                    `created ${newNotes.length} new notes`,
                                    'sending to Anki...'
                                )

                                // Add the new notes to Anki
                                Anki
                                .addNotes(newNotes)
                                .then(res => {
                                    logResult(
                                        `${res.length} notes added`
                                    )

                                    // run the deck fixing function here
                                    // correctDecks();

                                    // Deltes the old notes
                                    logResult('deleting old notes...');
                                    Anki
                                        .deleteNotes(noteIds)
                                        .then(res => {
                                            logResult(`${noteIds.length} notes deleted`)
                                        })
                                })
                            }
                        }).catch(err => logResult(err))
                })
            })
        })       
}

export default changeSubs;