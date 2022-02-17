import {
  awsEc2DescribeInstances
} from '.'

const awsEc2Instances = async (client) => {
  const instances = [];
  const existingInstances = await awsEc2DescribeInstances(client)
  for (const reservation of existingInstances.Reservations) {
    const instance = reservation.Instances[0]
    if (instance.State.Name !== 'terminated') {
      instances.push({
        id: instance.InstanceId,
        status: instance.State.Name,
        publicIpAddress: instance.PublicIpAddress || "?",
        publicDnsName: instance.PublicDnsName || "?"
      })      
    }
  }
  return instances;
}

export default awsEc2Instances;