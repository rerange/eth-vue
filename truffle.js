const Web3 = require('web3')
const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')

var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// Get our mnemonic and create an hdwallet
var mnemonic = "piano file obey immense polar rack great subject clutch camera maid ostrich";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var engine = new ProviderEngine()
var web3 = new Web3(engine)

// static results
engine.addProvider(new FixtureSubprovider({
  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true,
}))

// cache layer
engine.addProvider(new CacheSubprovider())

// filters
engine.addProvider(new FilterSubprovider())

// pending nonce
engine.addProvider(new NonceSubprovider())

// vm
engine.addProvider(new VmSubprovider())

// id mgmt
engine.addProvider(new HookedWalletSubprovider({
  getAccounts: function(cb){ },
  approveTransaction: function(cb){ },
  signTransaction: function(cb){ },
}))

// data source
engine.addProvider(new RpcSubprovider({
  rpcUrl: 'https://testrpc.metamask.io/',
}))

// log new blocks
engine.on('block', function(block){
  console.log('================================')
  console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
  console.log('================================')
})

// network connectivity error
engine.on('error', function(err){
  // report connectivity errors
  console.error(err.stack)
})

engine.addProvider(new WalletSubprovider(wallet, {}));

// start polling for blocks
engine.start()

module.exports = {
  networks: {
    ropsten: {
      network_id: 3,    // Official ropsten network id
      provider: web3, // Use the custom provider
      from: address,     // Use the address derived address
      gas: 4444444
    },
    development: {
      host: "localhost",
      port: 8545, // This is the conventional port. If you're using the Ganache Blockchain, change port value to the Ganache default port 7545. If you're using Truffle develop network, change port value to 9545
      network_id: "*", // Match any network id. You may need to replace * with your network Id
      from: "", // Add your unlocked account within the double quotes
      gas: 4444444
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from: "",  // Findable under Ganache -> Addresses. Auth with Metamask and private key
      gas: 4444444
    }
  },
};
