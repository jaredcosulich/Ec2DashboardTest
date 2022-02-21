

import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  try {
    const ssh = new NodeSSH()

    const connection = await ssh.connect({
      host: ipAddress,
      username: 'ec2-user',
      privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
    })
  
    const fullCommand = commands.length > 1 ? `{ ${commands.join('; ')}; }` : commands[0]
    const loggedCommand = `${fullCommand} >> ~/log.txt 2>&1 &`
    connection.execCommand(`echo "${loggedCommand}" >> ~/log.txt 2>&1 &`)
    connection.execCommand(loggedCommand, { cwd: directory })  
  } catch (e) {
    console.log("Error connecting via SSH", e)
  }
}

export default sshCommands;