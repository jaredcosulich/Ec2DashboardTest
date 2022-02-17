



import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  console.log("HI1")
  console.log("HI2", ipAddress)
  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  const fullCommand = commands.join(' && ') + ' >> ~/log.txt 2>&1 &'
  console.log("HI3", fullCommand)
  const response = await connection.execCommand(fullCommand, { cwd: directory })
  console.log("HI4", response)
  return response
}

export default sshCommands;