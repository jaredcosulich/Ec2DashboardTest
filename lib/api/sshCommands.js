



import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  console.log("HI1")
  console.log("HI2", ipAddress, process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n'))
  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  console.log("HI3", connection)

  const fullCommand = commands.join(' && ') + ' >> ~/log.txt 2>&1 &'
  const response = await connection.exec(fullCommand, { cwd: directory })
  console.log("HI4", fullCommand, response)
  return response
}

export default sshCommands;