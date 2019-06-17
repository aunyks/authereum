const authereum = require('./authereum')
const express = require('express')
const app = express()

const fromUtcIso = (s) => {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
const toUtcIso = (d) => d.toISOString()

// for addr use web3.eth.accounts.givenProvider.selectedAddress
// await web3.eth.sign(new Date().toISOString(), "0xc9c50b55c3085606ff05c70ac8cbaf26240891ae")
// b64 encode stringified signature obj
// Authorization: Web3 <b64 payload>

// b64 decode auth payload
// parse json object
// web3.eth.accounts.recover(<sig object>)

const lastInArr = arr => arr[arr.length - 1]
const b64Decode = new Buffer(b64, 'base64').toString('ascii')

const parseHeader = authHeader => {
  const headerArr = authHeader.split(' ')
  const token = lastInArr(headerArr)
  const jsonStr = b64Decode(token)
  const sigObj = JSON.parse(jsonStr)
  const message = sigObj.message
  const account = web3.eth.accounts.recover(sigObj)
  return { message, account }
}

const getMessage = parsedHeader => parsedHeader.message
const getAccount = parsedHeader => parsedHeader.account

app.use((req, res, next) => {
  console.log('Authorization: ' + req.get('Authorization'))
  next()
})

app.post('/', (req, res) => {
  res.sendStatus(204)
})

app.listen(3000, () => console.log('App is listening'))
