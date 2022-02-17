import { RunInstancesCommand, CreateTagsCommand } from "@aws-sdk/client-ec2";

const awsEc2Test = async (ec2Client) => {
  
  const instanceParams = {
    // ImageId: "ami-033b95fb8079dc481", //Generic Amazon Linux AMI
    ImageId: "ami-0dcee1937b7265949", // Node pre-installed
    InstanceType: "t2.micro",
    KeyName: "Prototype", //KEY_PAIR_NAME
    MinCount: 1,
    MaxCount: 1,
  };

  try {
    const data = await ec2Client.send(new RunInstancesCommand(instanceParams));
    const instanceId = data.Instances[0].InstanceId;
    return instanceId;
    // Add tags to the instance
    // const tagParams = {
    //   Resources: [instanceId],
    //   Tags: [
    //     {
    //       Key: "Name",
    //       Value: "SDK Sample",
    //     },
    //   ],
    // };
    // try {
    //   const data = await ec2Client.send(new CreateTagsCommand(tagParams));
    //   console.log("Instance tagged", data);
    // } catch (err) {
    //   console.log("Error", err);
    // }
  } catch (err) {
    console.log("Error", err);
  }
}

export default awsEc2Test;