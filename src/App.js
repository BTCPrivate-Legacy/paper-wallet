import React, { Component } from 'react';

import Header       from './components/Header';
import MainPanel    from './components/MainPanel';
import Footer       from './components/Footer';


class App extends Component {
    render() {
        return (
            <div id="layout">

                <Header />
                <MainPanel />
                <Footer />

            </div>
        );
    }
}

export default App;
