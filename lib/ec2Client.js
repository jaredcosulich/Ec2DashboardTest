import { EC2Client } from "@aws-sdk/client-ec2";

const ec2Client = (region="us-east-1") => {
  return new EC2Client({ region: region });
}

export default ec2Client;