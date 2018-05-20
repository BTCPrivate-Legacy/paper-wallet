import React, { Component } from 'react';
import { Row, Col, Button, FormGroup, Radio, ControlLabel, FormControl }
                            from 'react-bootstrap';
import { QRCode }           from 'react-qr-svg';
import btcprivatejs            from 'btcprivatejs';


class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'T',
            input: '',
            priv: '',
            wif: '',
            addr: ''
        };
    }

    updateInputValue(e) {
        const _value    = e.target.value;

        this.setState({
            input: _value
        });
    }

    genTAddress() {
        let privWIF;
        let priv;

        try {
            if(!this.state.input) throw(this.state.input);

            if(this.state.input[0] === '5'
            || this.state.input[0] === 'L'
            || this.state.input[0] === 'K') {
                privWIF = this.state.input;
                priv    = btcprivatejs.address.WIFToPrivKey(privWIF);
            } else {
                priv    = this.state.input;
                privWIF = btcprivatejs.address.privKeyToWIF(priv, true);
            }
        } catch(e) {
            return alert("Invalid Private Key");
        }

        const pubKey    = btcprivatejs.address.privKeyToPubKey(priv, true);
        const znAddr    = btcprivatejs.address.pubKeyToAddr(pubKey);

        this.setState({
            priv: priv,
            wif: privWIF,
            addr: znAddr
        });
    }

    genZAddress() {
        const z_secretKey   = this.state.input;
        let spendingKey;
        let a_pk;
        let pk_enc;


        try {
            if(!z_secretKey) throw(z_secretKey);
            if(z_secretKey[0] !== '0') throw(z_secretKey);

            spendingKey = btcprivatejs.zaddress
                            .zSecretKeyToSpendingKey(z_secretKey);
            a_pk        = btcprivatejs.zaddress
                            .zSecretKeyToPayingKey(z_secretKey);
            pk_enc      = btcprivatejs.zaddress
                            .zSecretKeyToTransmissionKey(z_secretKey);
        } catch(e) {
            return alert("Invalid Private Key");
        }

        const Zaddress  = btcprivatejs.zaddress.mkZAddress(a_pk, pk_enc);

        this.setState({
            priv: z_secretKey,
            wif: spendingKey,
            addr: Zaddress
        });
    }

    handleCheckRadio(type) {
        this.setState({
            type: type,
            priv: '',
            wif: '',
            addr: ''
        });
    }

    getZpriv() {
        if (this.state.type === 'Z')
            return("Private Key: " + this.state.priv);
    }

    render() {
        return (
            <Col md={12} id="Details">
                <hr />
                <Row className="r1">
                    <Col md={3}>
                        <FormGroup>
                            <Radio name="detailsRadioGroup"
                            onChange={() => this.handleCheckRadio('T')}
                            checked={this.state.type === 'T'} inline>
                                B Address (Transparent)
                            </Radio>
                            <br />
                            <Radio name="detailsRadioGroup"
                            onChange={() => this.handleCheckRadio('Z')}
                            checked={this.state.type === 'Z'} inline>
                                Z Address (Private)
                            </Radio>
                        </FormGroup>
                    </Col>
                    <Col xs={3}>
                        <FormGroup controlId="privateKey"
                            bsSize="sm"
                        >
                            <ControlLabel>Enter Private Key</ControlLabel>
                            <FormControl type="text"
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={2} className="inherit-width">
                        <Button onClick={this.state.type === 'T' ?
                            () => this.genTAddress()
                            : () => this.genZAddress()}
                        >
                            View Details
                        </Button>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={window.print}>
                            Print
                        </Button>
                    </Col>
                </Row>
                <hr />
                {this.state.addr ? (
                    <Row className="r2">
                        <Col xs={6} className="max-width">
                            <h1 style={{color:'green'}}>Public</h1>
                            <h3>BTCP Address</h3>
                            <div>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="L"
                                    style={{ width: 256 }}
                                    value={this.state.addr}
                                />
                            </div>
                            <div>
                                {this.state.addr}
                            </div>
                        </Col>
                        <Col xs={6} className="max-width">
                            <h1 style={{color:'red'}}>Secret</h1>
                            <div>
                                {this.state.type === 'T' ? (
                                    <h3>Private Key</h3>
                                ) : (
                                    <h3>Spending Key</h3>
                                )}
                                <div>
                                    <QRCode
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                        level="L"
                                        style={{ width: 256 }}
                                        value={this.state.wif}
                                    />
                                </div>
                                <p>{this.state.wif}</p>
                            </div>
                            <p>{this.getZpriv()}</p>
                        </Col>
                    </Row>
                ) : (
                    <Row className="r2 no-padding"></Row>
                )}
                <hr />
                <Row className="r3">
                    <Col>
                        <p>
                            Entering your private key here allows you to view your Bitcoin Private (BTCP) address and print your wallet if you wish.
                        </p>
                        <p>
                            <b>Warning: make sure you are on paperwallet.btcprivate.org !</b>
                        </p>
                        <p>
                            Your private key is a sensitive element. Whomever knows it can manage your funds. If you enter your private key into some website, double-check the URL to avoid phishing attempts.
                        </p>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Details;
