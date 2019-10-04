import inquirer from 'inquirer';
import colors from 'colors';
import jishoApi from 'unofficial-jisho-api';

import Anki from '../services/Anki';
import changeSubs from '../scripts/changeSubs';

import MODELS from '../data/models';
import DECK_IDS from '../data/deck_ids';

const jisho = new jishoApi();

// take a jishoResp obect and returns an array that holds objects of japanese terms and
//  defintions
const listcurrentVocab = (jishoResp) => {
    // the logic that filters thru the japanese object and returns a usable term
    return jishoResp.map((term) => {
        // this logic exists because jishoApi() only returns a `word` if the word has
        // Kanji. Thus, if there's no word, use the rading instead
        const termString = term.japanese[0].word ?
                           term.japanese[0].word :
                           term.japanese[0].reading

        // combine all the definitions into one string
        const def = term.senses.map(sense => sense.english_definitions.join(', '))
                               .reduce((acc, cur, idx) => {
                                    return acc + `${idx+1}. ${cur}\n`;
                               }, '')

        const reading = term.japanese[0].reading;

        let pos = '';
        if ( // its a verb
            term.senses[0].parts_of_speech[0].includes('verb') || 
            term.senses[0].parts_of_speech[0].includes('Verb')) {
                pos = 'verb' // call it verb
            }
        else if ( // its an adjective
            term.senses[0].parts_of_speech[0].includes('adjective') || 
            term.senses[0].parts_of_speech[0].includes('Adjective')) {
                pos = 'adjective' // call it adjective
            }
        else { // just call it what it is
                pos = term.senses[0].parts_of_speech[0];
        }

        return {
            term: `${termString}`,
            def: `${def}`, 
            pos: `${pos}`, 
            reading: `${reading}`
        }
    });
}

// the main loop
const notesAddLoop = async (args) => {
    // saves the first argument to a tag
    let tag = args[0];
    let vocabArchive = [];

    // if no tag is saved, prompt the user for one
    if(!tag) {
        tag = await inquirer.prompt({
            type: 'input',
            name: 'tag',
            message: 'Input tag:'
        })
        // my favorite line:
        // because inquirer saves its input into object property, i use the terrible mutability 
        // of javascript to replace the variable "tag" with its own property... "tag"
        tag = tag.tag;
    }

    console.log(`Tag ${`"${tag}"`.green} has been selected`);

    let searching = true;
    while(searching) {
        let vocab = await inquirer.prompt({
            type: 'input',
            name: 'term',
            message: 'Enter term　(or \'q\' to quit):'
        })

        // exit condition
        if(vocab.term === 'q') {
            console.log('exiting...');
            searching = false;
            break;
        }

        // pull data from jisho
        let jishoResp = await jisho.searchForPhrase(vocab.term);
        jishoResp = jishoResp.data;

        // pull the first term from the jisho response and confirms if the user wants to add it
        const currentVocab = listcurrentVocab(jishoResp)[0];
        // checks that the word is not blank before running logic
        if(currentVocab) {
            console.log('\nSelected Term:'.cyan);
            console.log(currentVocab.term.green); // the term, highlighted
            console.log('Part of Speech:', currentVocab.pos); // the pos
            console.log(currentVocab.def); // the definition

            var confirm = await inquirer.prompt({
                type:'confirm',
                name: 'addTerm',
                message: 'Add?'
            });

            if(confirm.addTerm) {
                // add the term

                //search Anki for the term in Japanese note style; returns a truthy thing if exits
                const noteExists = await Anki
                    .findNotes('Vocabulary:' + currentVocab.term);
                
                if(noteExists.length) {
                    // add tag to card
                    console.log(`Note already exists in database... adding tag ${`"${tag}"`.green}`);
                    Anki.addTags(tag, noteExists);
                } else {
                    console.log('Note does not yet exitst')
                    let rootWord = currentVocab.term;
                    
                    // tests if the word's an い adjective
                    if (currentVocab.pos === 'adjective' && rootWord[rootWord.length - 1] === 'い') {
                        // if so, remove the い
                        rootWord = rootWord.slice(0,-1);
                        // note that this likely won't cause an issue with those few な addjectives that end with
                        // い, as the search term will still function
                    // tests if the word's a verb
                    } else if (currentVocab.pos === 'verb') {
                        // if so, removes the last -u character
                        rootWord = rootWord.slice(0,-1);
                    }

                    console.log('searching for notes in database with term...')
                    let subsNotes = await Anki
                        .findNotes(`note:${MODELS.subs2srs} ${rootWord}`);

                    // if it finds notes
                    if (subsNotes.length) {
                        console.log('note found!\n preparing note...');
                        // reduces the array to just its 1st entry
                        subsNotes = subsNotes.slice(0,1);
                        // updates Note field
                        Anki.updateNoteFields(subsNotes[0], {
                            'Note': currentVocab.term
                        });
                        // adds tags
                        Anki.addTags('00change ' + tag, subsNotes);
                    
                    // or, if it finds no notes...
                    } else {
                        console.log('no notes found. adding new card...')
                        // add the Jisho info to a new note
                        Anki.addNotes([{
                            "deckName": DECK_IDS.main,
                            "modelName": MODELS.japanese,
                            "fields": {
                                "Vocabulary": currentVocab.term,
                                "Vocabulary-Reading": currentVocab.reading,
                                "Meaning": currentVocab.def
                            },
                            tags: [tag]
                        }]);
                    }   
                }
                console.log('vocab', currentVocab.term);
                vocabArchive.push(currentVocab.term);
            }

            // return results 
            console.log('current archive', vocabArchive);
        } else {
            console.log('No term found, re-running search');
        }
    }

    changeSubs();
}

export default notesAddLoop;