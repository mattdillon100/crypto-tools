const fetch = require('node-fetch');
const Aws = require('aws-sdk');

const token1Address = '0x11111111111111111111111111111';
const token2Address = '0x22222222222222222222222222222';
const token3Address = '0x33333333333333333333333333333';

const dynamoDb = new Aws.DynamoDB();

const getReservePrices = async (base, quote) => {
  const query = `
{
  ethereum(network: bsc) {
    dexTrades(
      baseCurrency: {is: "${base}"}
      quoteCurrency: {is: "${quote}"}
      options: {desc: ["block.height", "transaction.index"], limit: 1}
    ) {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S")
        }
      }
      transaction {
        index
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      quotePrice
    }
  }
}`;

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.API_KEY
    },
    body: JSON.stringify({ query })
  };

  return await fetch('https://graphql.bitquery.io/', params)
    .then(response => response.json())
    .then(result => {
      return result.data.ethereum.dexTrades[0].quotePrice.toFixed(30);
    })
    .catch(error => {
      throw new Error(`Could not update price: ${error.message}`)
    });
}

const getTotal = async () => {
  const pornPerBnb = await getReservePrices(token1Address, token2Address);
  const bnbPerBusd = await getReservePrices(token2Address, token3Address);

  return (pornPerBnb * bnbPerBusd).toFixed(20);
}

const putPrice = async (price) => {
  const params = {
    Item: {
      'dateTime': {
        S: Date.now().toString()
      },
      'price': {
        N: price
      },
    },
    TableName: 'pornPrices'
  };

  try {
    return await dynamoDb.putItem(params).promise();
  } catch (e) {
    throw new Error(`Could not update price: ${e.message}`)
  }
}

// Run the thing
getTotal().then(putPrice);
