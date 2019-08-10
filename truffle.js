var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
var VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
var RpcSubprovider = require("web3-provider-engine/subproviders/rpc.js");

// Get our mnemonic and create an hdwallet
var mnemonic = "piano file obey immense polar rack great subject clutch camera maid ostrich";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var providerUrl = "https://testrpc.metamask.io/";
var engine = new ProviderEngine();

// cache layer
engine.addProvider(new CacheSubprovider())
 
// filters
engine.addProvider(new FilterSubprovider())
 
// pending nonce
engine.addProvider(new NonceSubprovider())
 
// vm
engine.addProvider(new VmSubprovider())

engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new RpcSubprovider({
  rpcUrl: providerUrl,
}));
engine.start(); // Required by the provider engine.

module.exports = {
  networks: {
    ropsten: {
      network_id: 3,    // Official ropsten network id
      provider: engine, // Use the custom provider
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
