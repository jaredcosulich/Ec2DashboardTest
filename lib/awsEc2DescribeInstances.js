import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const awsEc2DescribeInstances = async (ec2Client) => {
  try {
    const data = await ec2Client.send(new DescribeInstancesCommand({}));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export default awsEc2DescribeInstances;