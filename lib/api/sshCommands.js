



import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  const loggedCommands = commands.map(
    (command) => `${command} >> ~/log.txt 2>&1 &`
  )
  const fullCommand = loggedCommands.join(' && ')
  connection.execCommand(fullCommand, { cwd: directory })
}

export default sshCommands;