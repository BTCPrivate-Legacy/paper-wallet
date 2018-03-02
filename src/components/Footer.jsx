import React, { Component } from 'react';
import { Grid, Row, Col }   from 'react-bootstrap';

import website from "../website.png";
import twitter from "../twitter.png";

export default class Footer extends Component {
    render() {
        return (
            <Grid fluid={true} id="footer">
                <br />
                <div className="container">
                <Row>
                    <Col xs={12} className="footerSocialWrap">
                        <ul className="footerSocial">
                            <li>
                                <a href="https://btcprivate.org/">
                                    <img src={website} alt="website"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/bitcoinprivate">
                                    <img src={twitter} alt="twitter"/>
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col xs={12}>

                    </Col>
                </Row>
                </div>
                <div>
                <p className="footerCopyright">
                    {/* ZCL donations to maintain the servers: t1HzsNXe9B5AL7vc3ZJp3c7ZG5zjUWSYvSi */}
                </p>

                <p className="footerCopyright">
                    <a href="https://github.com/GGCryptoh" target="_blank" rel="noopener noreferrer">JavaScript Client-Side Bitcoin Private Wallet Generator</a>
                </p>
                </div>
            </Grid>
        );
    }
}
