import React, { Component } from 'react';
import { Row, Col, Button, FormGroup, Radio }
                            from 'react-bootstrap';
import { QRCode }           from 'react-qr-svg';
import { HDNode }           from 'bitcoinjs-lib';
import btcprivatejs         from 'btcprivatejs';
import bip39                from 'bip39';

class HD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
        };
    }

    genMnemonic() {
        console.log(this.props.entropy);
        // import your root xprv you gave
  //var hd = HDNode.fromBase58('xprv9s21ZrQH143K2XmdMqcWE29L75KLystP5qeMrRh7NJZdKvdRykoR6wNVohA7yUeaRtK2vni2ybAAY7mt8QyAmJDt6EF7f7DhbHFNMit7keL')
  // derive m/44'/0'/0' and export as base58check
  //> hd.deriveHardened(44).deriveHardened(0).deriveHardened(0).toBase58()
  //'xprv9z7KYqivhqD6FHfsDLbFEPDfWFt6xHzV1j3fG4rHoV4w2ppyd74aY8UwywJb8eqxAoJ7NqiDp1dCsYzicgnGPkhmhbLZkMnWhMwUxa23Uah'
        var m = bip39.generateMnemonic();
        console.log(m.toString());
        var hd = HDNode.fromSeedHex(bip39.mnemonicToSeedHex(m));
        console.log(hd.toBase58());

        this.setState({
          mnemonic: m,
          xprv: hd.toBase58(),
          xpub: hd.neutered().toBase58()
        });
    }

    handleCheckRadio(type) {
      this.setState({
        type: type,
        mnemonic: '',
        xprv: '',
        xpub: ''
      });
    }

    render() {
        return (
          <Col md={12} id="HD">
            <Row className="r1">
                <Col md={2} className="inherit-width">
                    <Button onClick={() => this.genMnemonic()}>
                        Generate New HD Wallet
                    </Button>
                </Col>
                <Col md={2}>
                    <Button onClick={window.print}>
                        Print
                    </Button>
                </Col>
            </Row>

            {this.state.mnemonic ? (
              <Row className="r2">
                  <Col xs={12} className="max-width singleTabs col-xs-offset-3">
                      <h1 style={{color:'red'}}>Private</h1>
                      <h3>BIP39 Mnemonic</h3>
                      <div className="mnemonic">
                          {this.state.mnemonic}
                      </div>
                      <div className="xprv">
                          {this.state.xprv}
                      </div>
                      <div className="xpub">
                          {this.state.xpub}
                      </div>
                  </Col>

              </Row>
            ) : (
              <Row className="r2 no-padding"></Row>
            )}

                <hr />
                <Row className="r3">
                    <Col>
                        <div>
                        <p>
                            <b>A Bitcoin Private Wallet</b> can be as simple as a single pairing of an address with its corresponding private key. You can share your address to receive BTCP payments, however your private key is what allows you to unlock, manage, and send your funds - <b>keep it safe</b>.
                        </p>
                        <p>
                            <b>**To safeguard this wallet**</b> you must print or otherwise record the address and private key. It is important to make a backup copy of the private key and store it in a safe location. This site does not have knowledge of your private key. If you leave/refresh the site or press the "Generate New Address" button then a new private key will be generated and the previously displayed private key will be forever lost. Your private key should be kept a secret. Whomever you share the private key with has access to spend all the BTCP associated with that address. If you print your wallet then store it in a zip lock bag to keep it safe from water. Treat a paper wallet like cash.
                        </p>
                        <br/>
                        <p>
                            <b>Add funds</b> to this wallet by instructing others to send BTCP to your BTCP address.
                        </p>
                        <p>
                            <b>Check your balance</b> by entering your BTCP address on one of these explorers:
                        </p>
                        <ul style={{listStyleType: 'none'}}>
                            <li><a href="https://explorer.btcprivate.org/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>https://explorer.btcprivate.org</a></li>
                        </ul>
                        <br/>
                        <p>
                            <b>To spend your BTCP,</b> you can download a wallet from <a href='https://btcprivate.org' target="_blank" rel="noopener noreferrer">Bitcoin Private</a> and import your private key to the p2p client wallet. It is <b>**strongly discouraged**</b> to spend directly from this address without importing the private key into a wallet application, since certain precautions need to be taken so you receive your change!
                        </p>
                        </div>
                    </Col>
                </Row>
            </Col>
        );
    }
}

/*
    getZpriv() {
        if (this.state.type === 'Z') { } //return("Private Key: " + this.state.priv);
    }
*/

export default HD;
