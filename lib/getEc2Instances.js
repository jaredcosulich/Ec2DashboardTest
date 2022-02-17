const getEc2Instances = async () => {
  const response = await fetch('/api/ec2/instances', {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin'
  })
  return await response.json();
}

export default getEc2Instances;