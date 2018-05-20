import React, { Component } from 'react';
import { Row, Col, Button }
                            from 'react-bootstrap';
import { HDNode }           from 'bitcoinjs-lib';
import bip39                from 'bip39';

class HD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
        };
    }

    genMnemonic() {
        var m = bip39.entropyToMnemonic(this.props.entropy.toString(16).substring(0, 32))
        //var m = bip39.generateMnemonic();
        //console.log(m.toString());

        var hd = HDNode.fromSeedHex(bip39.mnemonicToSeedHex(m));
        //console.log(hd.toBase58());

        var masterXprv = hd.toBase58();
        var masterXpub = hd.neutered().toBase58();

        var derivedHD = hd.deriveHardened(44).deriveHardened(183).deriveHardened(0);
        var derivedXprv = derivedHD.toBase58();
        var derivedXpub = derivedHD.neutered().toBase58();

        this.setState({
          mnemonic: m,
          xprv: masterXprv,
          xpub: masterXpub,
          derivedXprv: derivedXprv,
          derivedXpub: derivedXpub
        });
    }

    handleCheckRadio(type) {
      this.setState({
        type: type,
        mnemonic: '',
        xprv: '',
        xpub: '',
        derivedXprv: '',
        derivedXpub: ''
      });
    }

    render() {
        return (
          <Col md={12} id="HD">
            <Row className="r1">
                <Col md={2} className="inherit-width">
                    <Button onClick={() => this.genMnemonic()}>
                        Reveal your new HD Wallet
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
                  <Col xs={12} className="max-width singleTabs">
                      <h1 style={{color:'red'}}>Private</h1>
                      <h3>BIP39 Mnemonic</h3>
                      <h5>master seed words (= master xprv)</h5>
                      <div className="mnemonic">
                          {this.state.mnemonic}
                      </div>
                      <h5>master xpub/xprv (m/)</h5>
                      <div className="xprv">
                          {this.state.xprv}
                      </div>
                      <div className="xpub">
                          {this.state.xpub}
                      </div>
                      <h5>xpub/xprv derived at BIP44 for BTCP, account 0 (m/44'/183'/0')</h5>
                      <div className="derivedXprv">
                          {this.state.derivedXprv}
                      </div>
                      <div className="derivedXpub">
                          {this.state.derivedXpub}
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
                            <b>A Bitcoin Private HD Wallet</b> is a mnemonic phrase of English words. These are determined by your initial mouse movements, and result in a seed for chains of wallets/addresses. These allow for chains selected by 'derivation path' (bip32/bip44), whose keys start with 'xprv'. You can also export a corresponding, view/'generate'-only 'xpub'. Your mnemonic seed words, or your master 'xprv' key, or your derived 'xprv' key will allow you to unlock, manage, and spend those corresponding funds - <b>keep it safe</b>.
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

export default HD;
