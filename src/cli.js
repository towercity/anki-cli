import arg from 'arg';
import inquirer from 'inquirer';

import correctDeck from '../src/scripts/correctDecks';
import changeSubs from '../src/scripts/changeSubs';

const  parseArgumentsIntoOptions = (rawArgs) => {
    const args = arg(
      {
        '--help': Boolean,
        '-h': '--help'
      },
      {
        argv: rawArgs.slice(2),
      }
    );
    return {
      help: args['--help'] || false,
      cmd: args._[0]
    };
}

async function selectScript(options) {
    // if a command has been entered, proceed
    if (options.cmd) {
        return { 
            ...options
        }

    // otherwise, a selection process is run
    } else {
        // select possible commands
        const answers = await inquirer.prompt({
            type: 'list',
            name: 'cmd',
            message: 'Please select a script to run',
            choices: ['00change', 'correct decks']
        });
        return {
            ...options,
            cmd: answers.cmd
        }
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await selectScript(options);
    console.log(options);
}