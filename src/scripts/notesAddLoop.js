import Anki from '../services/Anki';
import inquirer from 'inquirer';
import colors from 'colors';
import jishoApi from 'unofficial-jisho-api';
import path from 'path';
import MODELS from '../data/models';

const jisho = new jishoApi();

// take a jishoResp obect and returns a string of japanese terms and defintions
// check these variables against those returned by unofficial-jisho-api
const listJishoTerms = (jishoResp) => {
    // the logic that filters thru the japanese object and returns a usable term
    return jishoResp.map((term) => {
        const termString = term.japanese[0].word ?
                           term.japanese[0].word :
                           term.japanese[0].reading

        const def = term.senses.map(sense => sense.english_definitions.join(', '))
                               .reduce((acc, cur, idx) => {
                                    return acc + `${idx+1}. ${cur}\n`;
                               }, '')

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

        return [`${termString}`, `${def}`, `${pos}`];
    });
}


const notesAddLoop = async (args) => {
    // saves the first argument to a tag
    let tag = args[0];
    let searching = true;

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

    while(searching) {
        let vocab = await inquirer.prompt({
            type: 'input',
            name: 'term',
            message: 'Enter term　(or \'q\' to quit):'
        })

        // exit condition
        if(vocab.term === 'q') {
            console.log('exit');
            searching = false;
            break;
        }

        // pull data from jisho
        let jishoResp = await jisho.searchForPhrase(vocab.term);
        jishoResp = jishoResp.data;
        // console.log(jishoResp[0].senses)

        // pull the first terms from the jisho response and confirms if the user wants to add it
        const jishoTerms = listJishoTerms(jishoResp)[0];
        // checks that the word is not blank before running logic
        if(jishoTerms) {
            console.log(jishoTerms)
            console.log('\nSelected Term:'.cyan);
            console.log(jishoTerms[0].green); // the term, highlighted
            console.log('Part of Speech:', jishoTerms[2]); // the pos
            console.log(jishoTerms[1]); // the definition

            var confirm = await inquirer.prompt({
                type:'confirm',
                name: 'addTerm',
                message: 'Add?'
            });

            if(confirm.addTerm) {
                // add the term

                //search Anki for the term in Japanese note style; returns a truthy thing if exits
                const noteExists = await Anki
                    .findNotes('Vocabulary:' + jishoTerms[0]);
                
                if(noteExists.length) {
                    // add tag to card
                    console.log(`Note already exists in database... adding tag ${`"${tag}"`.green}`);
                    Anki.addTags(tag, noteExists);
                } else {
                    let rootWord = jishoTerms[0];
                    
                    // tests if the word's an い adjective
                    if (jishoTerms[2] === 'adjective' && rootWord[rootWord.length - 1] === 'い') {
                        // if so, remove the い
                        rootWord = rootWord.slice(0,-1);
                        // note that this likely won't cause an issue with those few な addjectives that end with
                        // い, as the search term will still function
                    // tests if the word's a verb
                    } else if (jishoTerms[2] === 'verb') {
                        // if so, removes the last -u character
                        rootWord = rootWord.slice(0,-1);
                    }

                    const subsNotes = await Anki
                        .findNotes(`note:${MODELS.subs2srs} ${rootWord}`);

                    // if it finds notes
                    if (subsNotes.length) {
                        // reduces the array to just its 1st entry
                        subsNotes = subsNotes.slice(0,1);
                        // updates Note field
                        Anki.updateNoteFields(subsNotes[0], {
                            'Note': jishoTerms[0]
                        });
                        // adds tags
                        Anki.addTags(`00change ${tag}`, subsNotes);
                    
                    // or, if it finds no notes...
                    } else {
                        // add the Jisho info to a new note
                    }

                    
                }
                //      if not, search in subs
                //          if there, add 00change tag and term into 'notes'
                //          if not, add a card with jisho def
                console.log('vocab', vocab);
                vocabArchive.push(jishoTerms[0]);
            }

            // return results 
            console.log('current archive', vocabArchive);
        } else {
            console.log('No term found, re-running search');
        }
    }
}

export default notesAddLoop;