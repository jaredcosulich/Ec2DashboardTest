import {
  ec2Client,
  awsEc2TerminateInstances
} from '../../../lib'

export default async function handle(req, res) {
  const instanceIds = req.body.instanceIds;
  
  const client = ec2Client("us-east-1")
  await awsEc2TerminateInstances(client, instanceIds)
  res.json({})
}