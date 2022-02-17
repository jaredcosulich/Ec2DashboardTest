const startEc2Instance = async () => {
  const response = await fetch('/api/ec2/start', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({}),
  })
  return response;
}

export default startEc2Instance;