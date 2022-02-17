



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
  
  await sshCommands(
    ipAddress, 
    commands, 
    directory
  );
  res.json({});
}