import arg from 'arg';

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



export function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
}