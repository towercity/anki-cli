import inquirer from 'inquirer';
import cliScripts from '../src/scripts/all';

import correctDeck from '../src/scripts/correctDecks';
import changeSubs from '../src/scripts/changeSubs';

// dynamically generated list of scripts from cliScripts and adds an exit function
const scriptNames = Object.keys(cliScripts);
scriptNames.push('exit');

const  parseArgumentsIntoOptions = (rawArgs) => {
    const [cmd, ...args] = rawArgs.slice(2);
    return {
        cmd: cmd,
        args: args
    }
}

async function selectScript(options) {
    // if a command has been entered, proceed
    console.log(scriptNames, options.cmd)
    if (scriptNames.find(cmd => cmd === options.cmd)) {
        return { 
            ...options
        }

    // otherwise, a selection process is run
    } else {
        // select possible commands
        console.log('no included script selected');
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'cmd',
            message: 'Please select a script to run',
            choices: scriptNames
        });
        return {
            ...options,
            cmd: answers.cmd
        }
    }
}

export async function cli(args) {
    console.log('scripts', scriptNames);

    let options = parseArgumentsIntoOptions(args);
    options = await selectScript(options);
    
    switch(options.cmd) {
        case '00change':
            changeSubs();
            break;
        case 'correct-decks':
            correctDeck();
            break;
        case 'exit':
            console.log('exiting scripts...\n');
            break;
        default:
            console.log('no script selected');
            console.log('exiting scripts...\n');
            break;
    }
}