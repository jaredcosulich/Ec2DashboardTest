import { TerminateInstancesCommand, TerminateInstancesCommandInput  } from "@aws-sdk/client-ec2";

const awsEc2TerminateInstances = async (ec2Client, instanceIds) => {
  try {
    const input = { InstanceIds: instanceIds }
    const command = new TerminateInstancesCommand(input)
    const response = await ec2Client.send(command);
    return response;
  } catch (err) {
    console.log("Error", err);
  }
};

export default awsEc2TerminateInstances;