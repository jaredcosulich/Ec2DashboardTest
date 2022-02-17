import { EC2Client } from "@aws-sdk/client-ec2";

const ec2Client = (region="us-east-1") => {
  return new EC2Client({ 
    region: region,
    credentials: {
      accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
    }
  });
}

export default ec2Client;