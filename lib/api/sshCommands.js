

import { NodeSSH } from 'node-ssh';

const sshCommands = async (ipAddress, commands, directory='') => {
  const ssh = new NodeSSH()

  const connection = await ssh.connect({
    host: ipAddress,
    username: 'ec2-user',
    privateKey: process.env.AWS_PROTOTYPE_PEM.replace(/\\n/g, '\n')
  })

  // for (const command of commands) {
  //   connection.execCommand(command, {
  //     // cwd: dir,
  //     onStdout(chunk) {
  //       console.log('stdoutChunk', chunk.toString('utf8'))
  //     },
  //     onStderr(chunk) {
  //       console.log('stderrChunk', chunk.toString('utf8'))
  //     },
  //   })
  // }

  console.log("RUNNING COMMAND", commands.join(' && '))
  const result = await connection.execCommand(commands.join(' && ') + ' >> ~/log.txt 2>&1 &', {cwd: directory})
  console.log("COMMAND COMPLETE", commands.join(' && '), result)
  return result;
}

export default sshCommands;