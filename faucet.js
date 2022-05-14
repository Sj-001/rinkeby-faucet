const express = require("express");
const Web3 = require("web3");
const abi = require("./abi.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const bodyParser = require("body-parser");

require("dotenv").config();

// console.log(process.env.PRIVATE_KEY);

let provider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY],
  providerOrUrl:
    "wss://rinkeby.infura.io/ws/v3/9598959dac984109a2bf08134b38afc6",
});
let web3 = new Web3(provider);
let faucetContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
let account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY, [
  ,
  true,
]);

// console.log(account);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/get-ether", async (req, res) => {
  var address = req.body.address;
  // var checksumAddress = web3.utils.toChecksumAddress(address);
  console.log(address);
  try {
    var sent = await faucetContract.methods
      .getEther(address)
      .send({ from: account.address });
    res.send(sent);
  } catch (err) {
    res.send(err.message);
  }
});
// console.log(faucetContract);
app.listen(5000, () => {
  console.log("Live on 5000 port");
});
