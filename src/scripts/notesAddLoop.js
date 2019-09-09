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
            message: 'Enter term:'
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
        
        // listJishoTerms(jishoResp).forEach(def => console.log(def));
        // loops thru each returned term and asks the user if they want to add the term
        // uses Array.some() so the loop can break once the term is chosen
        listJishoTerms(jishoResp).some(async (term) => {
            console.log('Selected Term:'.cyan);
            console.log(
                term[0].green, // the term, highlighted
                term[1] // the definition
            );

            inquirer.prompt({
                type: 'confirm',
                name: 'yes',
                message: 'Add this term?'
            });
            
            // if the term is selected, update the vocab.term to match then
            // return true to leave the loop
            if (true) {
                // splits everything after the linebreak: this cuts everything off but the selected term
                vocab.term = term[0]
            }

            // return false;
        });

        console.log('vocab', vocab);
        vocabArchive.push(vocab);
        console.log('current archive', vocabArchive);
    }

    console.log('ended loop');
}

export default notesAddLoop;