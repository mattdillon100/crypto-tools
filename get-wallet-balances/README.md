# Get Balances for Multiple Wallets

This code will for the following:
 1. Read a JSON object containing wallet addresses and owners from S3
 2. Get the specified coin balances for these wallets from the BSCScan API
 3. Compiles the balances into a JSON object and saves this in a JSON file in S3

The `exampleWallet.json` and `exampleOutput.json` files in this repository are samples of input/output JSON,
respectively.

## Dependencies

This applet has been written in NodeJS and includes the `package.json` file for the NodeJS dependencies.

If you are not running this in a Lambda function, you will need to move the aws-sdk dev dependency to the main
dependencies list in `package.json`.

I wrote this to be used in a Lambda function. I will not provide details on how to get this working in Lambda, since
the details relating to permissions in AWS are out of scope for this readme.

If you want to run this locally, move the `aws-sdk` dependency (as mentioned above) and ensure you have AWS credentials
set up as per the instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

The `abi.json` file is very basic but should cover most Ethereum-based tokens.

## Running

To run from your CLI, simply execute the following command:

```shell
$ node index.js
```
