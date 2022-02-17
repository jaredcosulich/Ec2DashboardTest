import {
  ec2Client,
  awsEc2Instances,
  awsEc2StartInstance
} from '../../../lib'

export default async function handle(_req, res) {
  const client = ec2Client("us-east-1")

  const instances = await awsEc2Instances(client)

  const runningInstances = instances.filter(
    (instance) => ['running', 'pending'].includes(instance.status)
  )

  if (runningInstances.length === 0) {
    const newInstanceId = await awsEc2StartInstance(client)
    instances.push({
      id: newInstanceId,
      status: 'pending'
    })
  }

  res.json(instances)
}