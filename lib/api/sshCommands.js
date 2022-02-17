

import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  console.log("NEW SSH")
  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  console.log("SSH", connection)

  console.log("RUNNING COMMAND", commands.join(' && '))
  const fullCommand = commands.join(' && ') + ' >> ~/log.txt 2>&1 &'
  // const result = await connection.execCommand(fullCommand, {cwd: directory})
  connection.execCommand(fullCommand, {
    cwd: directory,
    onStdout(chunk) {
      console.log('stdoutChunk', chunk.toString('utf8'))
    },
    onStderr(chunk) {
      console.log('stderrChunk', chunk.toString('utf8'))
    },
  })
  // console.log("COMMAND COMPLETE", commands.join(' && '), result)
  // return result;
}

export default sshCommands;