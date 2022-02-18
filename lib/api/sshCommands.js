



import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  const fullCommand = `{ ${commands.join('; ')}; } >> ~/log.txt 2>&1 &`
  connection.execCommand(`echo "${fullCommand}" >> ~/log.txt 2>&1 &`)
  connection.execCommand(fullCommand, { cwd: directory })
}

export default sshCommands;