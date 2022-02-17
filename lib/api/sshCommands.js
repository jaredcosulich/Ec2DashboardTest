



import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  console.log("HI")
  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  console.log("HI2", connection)

  const fullCommand = commands.join(' && ') + ' >> ~/log.txt 2>&1 &'
  connection.execCommand(fullCommand, { cwd: directory })
  console.log("HI3", fullCommand)
}

export default sshCommands;