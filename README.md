# Bitcoin Private Paper Wallet - paperwallet.btcprivate.org

### JavaScript Client-Side BTCP Paper Wallet Generator.
### v0.0.2

Uses [btcprivatejs](https://github.com/BTCPrivate/btcprivatejs) based on [zenaddress](https://github.com/ZencashOfficial/zenaddress).

Also uses [ch4ot1c/bitcoinjs-lib#v3.3.2-z](https://github.com/ch4ot1c/bitcoinjs-lib/releases/tag/v3.3.2-z) - for `hdnode` (HD Wallets) (BIP44, BIP39, BIP32)


Supports:
- Input entropy (Mouse + Keyboard)
- Generating Single Private Key + Addresses
- Generating BIP44 BTCP Wallets (from random BIP39 mnemonic seed words) (from input entropy)
- Creating multisig wallets (**needs further testing**)
- 'Bulk Wallet' generation (Individual addresses; not using HD seeds)
- Lookup Address by Private Key (**should be removed in deployed builds; web education anti-pattern**)
- Official Explorer, Source code backlinks
- English

To run:

```
npm install
npm start
```

To build a static version:

First:
```
npm run eject
vim config/webpack.config.prod.js
```

Then search for `UglifyJsPlugin`, and add to it's constructor:
```
mangle: {
  safari10: true,
  keep_fnames: true
},
```

Then run `node scripts/build.js`. The generated `build/` dir will contain the static files to place in your `wwwroot`.

