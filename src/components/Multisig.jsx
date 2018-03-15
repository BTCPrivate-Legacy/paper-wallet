import React, { Component }     from 'react';
import { Row, Col, Button, FormGroup, ControlLabel, FormControl }
                                from 'react-bootstrap';
import { QRCode }               from 'react-qr-svg';
import { address }              from 'btcprivatejs';

class Multisig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            min: 2,
            max: 3,
            priv: [],
            redeem: '',
            addr: ''
        };
    }

    updateInputValue(e) {
        const _value    = parseInt(e.target.value, 10);
        const _id       = e.target.id;
        const _state    = this.state;

        if(!Number.isInteger(_value)) {
            console.log(_value);
            return;
        }

        _state[_id] = _value;
        this.setState(_state);
    }

    genAddress() {
        const _state    = {
            min: this.state.min,
            max: this.state.max,
            priv: [],
            redeem: '',
            addr: ''
        };

        for(let i = 0 ; i < _state.max ; i++) {
            _state.priv.push( address.mkPrivKey(
                this.props.entropy + new Date().getTime() + i
            ));
        }

        _state.redeem   = address.mkMultiSigRedeemScript(
            _state.priv.map((x) => address.privKeyToPubKey(x, true)),
            _state.min,
            _state.max
        );

        _state.addr = address.multiSigRSToAddress(_state.redeem);

        this.setState(_state);
    }

    render() {
        return (
            <Col md={12} id="Multisig">
                <hr />
                <Row className="r1">
                    <Col md={3}>
                        <FormGroup controlId="min"
                            bsSize="sm"
                        >
                            <ControlLabel>Minimum signatures</ControlLabel>
                            <FormControl type="text"
                                placeholder="2"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup controlId="max"
                            bsSize="sm"
                        >
                            <ControlLabel>Total shares</ControlLabel>
                            <FormControl type="text"
                                placeholder="3"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={1} className="inherit-width">
                        <Button onClick={() => this.genAddress()}>
                            Generate
                        </Button>
                    </Col>
                    <Col md={1}>
                        <Button onClick={window.print}>
                            Print
                        </Button>
                    </Col>
                </Row>
                <hr />
                {this.state.addr ? (
                    <Row className="r2">
                        <Col md={4} className="max-width">
                            <h1 style={{color:'green'}}>Public</h1>
                            <h3>BTCP Address</h3>
                            <div>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="L"
                                    style={{ width: 200 }}
                                    value={this.state.addr}
                                />
                            </div>
                            <div className="zentabcode">
                                {this.state.addr}
                            </div>
                        </Col>
                        <Col md={8} className="max-width">
                            <h1 style={{color:'red'}}>Secret</h1>
                            <div>
                                <b>Redeem Script : </b> {this.state.redeem}
                            </div>
                            <div className="row">
                                <h3 className="multisigsubtitle">Private Keys</h3>
                                {this.state.priv.map((priv) => (
                                    <div className="col-md-4">
                                        <QRCode
                                            bgColor="#FFFFFF"
                                            fgColor="#000000"
                                            level="L"
                                            style={{ width: 150 }}
                                            value={priv}
                                        />
                                        <p className="multisigsecretcode">{priv}</p>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row className="r2 no-padding"></Row>
                )}
                <hr />
                <Row className="r3">
                    <Col>
                        <p>
                          <b>A Multi-Signature Wallet</b> is useful if the funds belong to more than one person. It's like a joint account.
                        </p>
                        <p>
                          You can choose how many people receive a key, and how many keys are required to send the funds.
                        </p>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Multisig;
