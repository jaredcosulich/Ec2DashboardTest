

import {
  sshCommands
} from '../../../lib/api'

export default async function handle(req, res) {
  const { ipAddress, commands, directory } = req.body;
  
  for (let i=0; i<commands.length; ++i) {
    const command = commands[i];
    if (command.startsWith('nodClone ')) {
      commands[i] = command.replace(
        'nodClone ',
        `git clone https://NodLabsXYZ:${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/`
      )
    }
  }

  console.log("COMMANDS", commands)
  const response = await sshCommands(
    ipAddress, 
    commands, 
    directory
  );
  console.log("RESPONSE", response)
  res.json(response || {});
}