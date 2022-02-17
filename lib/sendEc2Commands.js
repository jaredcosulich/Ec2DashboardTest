const sendEc2Commands = async (ipAddress, commands, directory) => {
  const response = await fetch('/api/ec2/send_commands', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ ipAddress, commands, directory }),
  })
  return response;
}

export default sendEc2Commands;