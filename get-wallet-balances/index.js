const AWS = require('aws-sdk');
const Web3 = require('web3');
const MIN_ABI = require('./abi.json');

// For the BINANCE_URL you can use any URL from the docs: https://docs.binance.org/smart-chain/developer/rpc.html
const BINANCE_URL = 'https://bsc-dataseed1.binance.org:443';
const TOKEN_ADDRESS = 'YOUR_TOKEN_HERE';
const S3_BUCKET = 'YOUR_S3_BUCKET';
const S3_WALLETS_KEY = 'wallets.json';
const S3_BALANCES_KEY = 'balances.json';

const s3 = new AWS.S3();


const getWalletBalance = async () => {
  const modelWallets = await getWalletList().then(result => JSON.parse(result));

  const web3 = new Web3(BINANCE_URL);
  const contract = new web3.eth.Contract(MIN_ABI, TOKEN_ADDRESS);

  const balances = [];

  for (const [name, address] of Object.entries(modelWallets)) {
    const balance = await contract.methods.balanceOf(address).call();
    balances.push({ [name]: balance })
  }

  return balances;
};

const getWalletList = async () => {
  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: S3_WALLETS_KEY
    }

    const data = await s3.getObject(params).promise();

    return data.Body.toString();
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

const putWalletBalances = async (balances) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: S3_BALANCES_KEY,
    Body: JSON.stringify(balances),
    ContentType: 'application/json',
  };

  try {
    return await s3.putObject(params).promise();
  } catch (e) {
    throw new Error(`Could not put file to S3: ${e.message}`)
  }
}

// Make the call. Console log for testing.
getWalletBalance()
  .then(balances => putWalletBalances(balances))
  .then(result => console.log(result));
