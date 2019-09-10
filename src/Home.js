import React from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import './index.css';

import UserOwns from './UserOwns';
import AppOwns from './AppOwns';
import LandingPage from './landing';
import Notfound from './notfound';
import SingleVisual from './SingleVisual';
import SecureEmbed from './SecureEmbed';

import { getEmailAddress, getFullName, adalApiFetch } from './adalConfig';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Logo from './logo.svg'
import { Navbar, Nav } from 'react-bootstrap';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      PageTitle: "",
      imgUrl: "",
      adTokenValue: ""
    }

  }

  componentDidMount() {
    adalApiFetch(fetch, 'https://graph.microsoft.com/v1.0/me/photos/48x48/$value', { encoding: null })
      .then((response) => {
        if (!response.ok) {
          return;
        }

        response.arrayBuffer()
          .then((imageArrayBuffer) => {
            var arrayBufferView = new Uint8Array(imageArrayBuffer);
            var blob = new Blob([arrayBufferView.buffer])
            let imageUrl = window.URL.createObjectURL(blob);
            this.setState({ imgUrl: imageUrl });
          })
      })
      .catch((error) => {
        console.error(error);
      })
  }

  render() {
    return (
      <React.Fragment>

        <Router>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand style={{ fontWeight: 500 }}>
              <img
                alt=""
                src={Logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {"Pizza Planet"}
            </Navbar.Brand>


            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Setup</Nav.Link>
              <Nav.Link as={Link} to="/SecureEmbed">Secure Embed</Nav.Link>
              <Nav.Link as={Link} to="/UserOwns">User-Owns-Data</Nav.Link>
              <Nav.Link as={Link} to="/AppOwns">App-Owns-Data</Nav.Link>
              <Nav.Link as={Link} to="/SingleVisual">Single Visual Embedding</Nav.Link>

            </Nav>

            <div className="mr-sm-2" style={{ position: 'absolute', top: 8, right: 50, color: 'white', fontWeight: 500 }} > {getFullName()} </div>
            <div className="mr-sm-2" style={{ position: 'absolute', top: 25, right: 50, color: '#027AB6', fontWeight: 500 }} > {getEmailAddress()} </div>
            <div>
              {
                this.state.imgUrl === "" ?
                  <AccountCircle style={{ color: 'grey' }} /> :
                  <img src={this.state.imgUrl}
                    alt="hello"
                    style={{ borderRadius: '50%', width: '30px', height: '30px' }}
                  />
              }
            </div>

          </Navbar>


          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/UserOwns" component={UserOwns} />
            <Route path="/AppOwns" component={AppOwns} />
            <Route path="/SingleVisual" component={SingleVisual} />
            <Route path="/SecureEmbed" component={SecureEmbed} />
            <Route component={Notfound} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }

}
export default Home;
