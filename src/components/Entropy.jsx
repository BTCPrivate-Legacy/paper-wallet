import React, { Component } from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, ProgressBar }
from 'react-bootstrap';

import {randomBytes} from 'crypto-browserify';

class Entropy extends Component {
    /*constructor(props) {
        super(props);
        //const entropy = this.props.getEntropy();
        //this.state = entropy;
    }*/

    seed(e){
        const _state = this.props.getEntropy();

        const timeStamp = new Date().getTime();
        const timeDiff = timeStamp - _state.lastInputTime;
        // seeding is over now we generate and display the address
        if (_state.seedCount === _state.seedLimit) {
          _state.seedCount++;

          _state.isStillSeeding = false;
          this.removePoints();
          _state.random = _state.random.toString('hex');
          this.props.setEntropy(_state);
        }
        // seed mouse position X and Y when mouse movements are greater than 40ms apart.
        else if ((_state.seedCount < _state.seedLimit)
                && e
                && (timeDiff) > 40) {

            _state.random = this.mergeTypedArrays(
                _state.random,
                randomBytes(((timeDiff + e.clientX + e.clientY) % 65535 ) | 0)
            );

            this.showPoint(e.clientX, e.clientY);

            _state.seedCount++;
            _state.lastInputTime = timeStamp;
        }

        this.props.setEntropy(_state);
    }

    mergeTypedArrays(a, b) {
        // Checks for truthy values on both arrays
        if(!a && !b) console.error('Please specify valid arguments for parameters a and b.');

        // Checks for truthy values or empty arrays on each argument
        // to avoid the unnecessary construction of a new array and
        // the type comparison
        if(!b || b.length === 0) return a;
        if(!a || a.length === 0) return b;

        // Make sure that both typed arrays are of the same type
        if(Object.prototype.toString.call(a) !== Object.prototype.toString.call(b))
            console.error('The types of the two arguments passed for parameters a and b do not match.');

        var c = new a.constructor(a.length + b.length);
        c.set(a);
        c.set(b, a.length);

        return c;
    }

    seedKeyPress(e) {
        const _state = this.props.getEntropy();

        if (_state.seedCount === _state.seedLimit) {
            _state.seedCount++;

            _state.isStillSeeding = false;
            this.removePoints();
            _state.random = _state.random.toString('hex');
            this.props.setEntropy(_state);
        }
        else if ((_state.seedCount < _state.seedLimit) && e.key) {

            const timeStamp = new Date().getTime();
            const timeDiff = timeStamp - _state.lastInputTime;
            const keyCode = e.key.charCodeAt(0);

            _state.random = this.mergeTypedArrays(
                _state.random,
                randomBytes(((timeDiff + keyCode) % 65535 ) | 0)
            );

            _state.seedCount++;
            _state.lastInputTime = timeStamp;
        }

        this.props.setEntropy(_state);
    }

    getSeedingProgress(){
      const _state = this.props.getEntropy();
      return(
        Math.trunc((_state.seedCount * 100) / _state.seedLimit)
      );
    }

    showPoint(x, y) {
        const _state = this.props.getEntropy();

        var div = document.createElement("div");
        div.setAttribute("class", "seedpoint");
        div.style.top = y + "px";
        div.style.left = x + "px";
        document.body.appendChild(div);

        _state.seedPoints.push(div);
        this.props.setEntropy(_state);
    }

    removePoints() {
        const _state = this.props.getEntropy();
        for (let i = 0; i < _state.seedPoints.length; i++) {
            document.body.removeChild(_state.seedPoints[i]);
        }
        _state.seedPoints = [];
        this.props.setEntropy(_state);
    }

    render() {
        return (
          <Col xs={12} id="Entropy">
              <Row className="r3">
                  <Col>
                      <ProgressBar
                        now={this.getSeedingProgress()}
                        label={`${this.getSeedingProgress()}%`} />
                      <div id="seedMouseBox"
                          onMouseMove={e => this.seed(e)}
                      ><p>Move your mouse around to generate randomness</p></div>
                      <p>
                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>... or type random letters and numbers here:</ControlLabel>
                            <FormControl
                                type="text"
                                onKeyPress={e => this.seedKeyPress(e)}
                            />
                        </FormGroup>
                      </p>
                  </Col>
              </Row>
          </Col>
        );
    }
}

export default Entropy;
