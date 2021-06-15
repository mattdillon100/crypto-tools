# Get Token Price

This bit of code does the following:

1. Fetches the pairing price for each token in the order below
2. Pushes the final price in USD to a DynamoDB table for reference

I have used the [BitQuery GraphQL endpoint](https://bitquery.io/labs/graphql) to achieve the result. Please read their
documentation to learn about rate limiting, as well as other uses of the endpoint.

## Dependencies

This applet has been written in NodeJS and includes the `package.json` file for the NodeJS dependencies.

If you are not running this in a Lambda function, you will need to move the aws-sdk dev dependency to the main
dependencies list in `package.json`.

I wrote this to be used in a Lambda function. I will not provide details on how to get this working in Lambda, since
the details relating to permissions in AWS are out of scope for this readme.

You also don't have to use the DynamoDB element of this code, I included is as an example of what you can do with the
output.

If you want to run this locally, move the `aws-sdk` dependency (as mentioned above) and ensure you have AWS credentials
set up as per the instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

# Inputs

- `token1Address` is the base token address
- `token2Address` is the token that is the direct pairing of token 1
- `token3Address` is the token that is the direct pairing of token 2

In most cases (especially for BEP-20 tokens) the 2nd token address is `BNB` and the 3rd is `BUSD`. BUSD is tethered 1:1
with USD so that will give you the current price in USD.

You can find the token addresses (again, for BSC tokens) by searching for their name in [BSCScan](https://bscscan.com).

## This is not a finished product

While this code will work, it is without any form of error checking and shouldn't be used in production as-is.
