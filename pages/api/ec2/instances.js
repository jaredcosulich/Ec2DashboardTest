import {
  ec2Client,
  awsEc2Instances
} from '../../../lib'

export default async function handle(_req, res) {
  const client = ec2Client("us-east-1")
  const instances = await awsEc2Instances(client)
  res.json(instances)
}