import Anki from '../services/Anki';
import inquirer from 'inquirer';
import colors from 'colors';
import jishoApi from 'unofficial-jisho-api';

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

        return [`${termString}`, `${def}`];
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

        // pull the first terms from the jisho response and confirms if the user wants to add it
        const jishoTerms = listJishoTerms(jishoResp)[0];
        // checks that the word is not blank before running logic
        if(jishoTerms) {
            console.log('\nSelected Term:'.cyan);
            console.log(jishoTerms[0].green); // the term, highlighted
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
                    console.log('not');
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