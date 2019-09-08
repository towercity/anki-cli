import inquirer from 'inquirer';
import cliScripts from '../src/scripts/all';

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
    if (scriptNames.find(cmd => cmd === options.cmd)) {
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
            choices: scriptNames
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

    // if exit, do nothing
    if (options.cmd === 'exit') {
        console.log('exiting scripts...\n');

    // if the script name exists, run the script
    } else if (scriptNames.find(cmd => cmd === options.cmd)) {
        cliScripts[options.cmd](options.args);

    } else {
        console.log('no command chosen');
        console.log('exiting scripts...\n');
    }
}