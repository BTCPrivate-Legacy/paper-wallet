import React, { Component }     from 'react';
import { Row, Col, Button, FormGroup, ControlLabel, FormControl, Table, Radio }
                                from 'react-bootstrap';
import { address, zaddress }    from 'btcprivatejs';

class Bulk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startIndex: 1,
            nbRows: 1,
            type: 'T',
            pairs: []
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

    genTAddress() {
        const _state    = this.state;
        _state.pairs    = [];

        for(let i = 0 ; i < this.state.nbRows ; i++) {
            const priv      = address
                .mkPrivKey(this.props.entropy + new Date().getTime() + i);
            const privWIF   = address.privKeyToWIF(priv, true);
            const pubKey    = address.privKeyToPubKey(priv, true);
            const znAddr    = address.pubKeyToAddr(pubKey);

            const _pairs = this.state.pairs;
            _pairs.push({
                index: _state.startIndex + i,
                priv: priv,
                wif: privWIF,
                addr: znAddr
            });

            _state.pairs = _pairs;
            this.setState(_state);
        }
    }

    genZAddress() {
        const _state    = this.state;
        _state.pairs    = [];

        for(let i = 0 ; i < this.state.nbRows ; i++) {
            const z_secretKey   = zaddress
                .mkZSecretKey(this.props.entropy + new Date().getTime() + i);
            const spendingKey   = zaddress
                                    .zSecretKeyToSpendingKey(z_secretKey);
            const a_pk          = zaddress
                                    .zSecretKeyToPayingKey(z_secretKey);
            const pk_enc        = zaddress
                                    .zSecretKeyToTransmissionKey(z_secretKey);
            const Zaddress      = zaddress.mkZAddress(a_pk, pk_enc);

            const _pairs = this.state.pairs;
            _pairs.push({
                index: _state.startIndex + i,
                priv: z_secretKey,
                wif: spendingKey,
                addr: Zaddress
            });

            _state.pairs = _pairs;
            this.setState(_state);
        }
    }

    handleCheckRadio(type) {
        this.setState({
            type: type,
            pairs: []
        });
    }

    render() {
        return (
            <Col md={12} id="Bulk">
                <hr />
                <Row className="r1">
                    <Col md={3}>
                        <FormGroup controlId="startIndex"
                            bsSize="sm"
                        >
                            <ControlLabel>Start Index</ControlLabel>
                            <FormControl type="text"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup controlId="nbRows"
                            bsSize="sm"
                        >
                            <ControlLabel>Rows to generate</ControlLabel>
                            <FormControl type="text"
                                value={this.state.inputValue}
                                onChange={e => this.updateInputValue(e)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Radio name="bulkRadioGroup"
                            onChange={() => this.handleCheckRadio('T')}
                            checked={this.state.type === 'T'} inline>
                                B Address (Transparent)
                            </Radio>
                            <br />
                            <Radio name="bulkRadioGroup"
                            onChange={() => this.handleCheckRadio('Z')}
                            checked={this.state.type === 'Z'} inline>
                                Z Address (Private)
                            </Radio>
                        </FormGroup>
                    </Col>
                    <Col md={1} className="inherit-width">
                        <Button onClick={this.state.type === 'T' ?
                            () => this.genTAddress()
                            : () => this.genZAddress()}
                        >
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
                {this.state.pairs[0] ? (
                    <Row className="r2">
                        <Col className="max-width">
                            <Table striped bordered condensed hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Address</th>
                                        {
                                            this.state.type === 'Z' ?
                                                (<th>Spending Key</th>)
                                                : null
                                        }
                                        <th>Private Key</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.pairs.map((pair) => (
                                        <tr>
                                            <td>{pair.index}</td>
                                            <td>{pair.addr}</td>
                                            <td>{pair.wif}</td>
                                            {
                                                this.state.type === 'Z' ?
                                                (<td>{pair.priv}</td>)
                                                : null
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                ) : (
                    <Row className="r2 no-padding"></Row>
                )}
                <hr />
                <Row className="r3">
                    <Col>
                        <p>
                            Generating several addresses at once can be useful for accepting BTCP payments on your website. You can import these addresses into your database and use a different address for each payment you receive. You can easily add more addresses into your database by choosing the correct start index to complete your list of addresses.
                        </p>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Bulk;
