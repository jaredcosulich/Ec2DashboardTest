const terminateEc2Instances = async (instanceIds) => {
  const response = await fetch('/api/ec2/terminate', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ instanceIds }),
  })
  return response;
}

export default terminateEc2Instances;