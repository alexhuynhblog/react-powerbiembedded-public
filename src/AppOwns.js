import React from 'react';
import { Container, Row, Col, Card, ButtonToolbar, ButtonGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Highlight from 'react-highlight'
import * as pbi from 'powerbi-client';
import queryString from 'query-string';
import secret from './secret'

class AppOwns extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      AppPageTitle: "App-Owns-Data Approach",
      adEmbedTokenValue: "",
      embedPBIToken: "",
      tokenadEmbedExpiration: "",
      tokenEmbedExpiration: "",
      OwnsSuccess: "",
      toggleEmbedFilterOff: "",
      toggleEmbedTransparentOff: "",
      toggleEmbedEditOff: "",
      toggleEmbedMobileOff: "",
      appShow: false
    }

    this.embediFrameContainer = this.embediFrameContainer.bind(this);
    this.removeAppBorder = this.removeAppBorder.bind(this);
    this.toggleAppNavigationbar = this.toggleAppNavigationbar.bind(this);
    this.toggleAppTransparent = this.toggleAppTransparent.bind(this);
    this.toggleAppEdit = this.toggleAppEdit.bind(this);
    this.appFullScreen = this.appFullScreen.bind(this);
    this.appPrintFeature = this.appPrintFeature.bind(this);
    this.handleAppShow = this.handleAppShow.bind(this);
    this.handleAppClose = this.handleAppClose.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getMasterGenerateToken = this.getMasterGenerateToken.bind(this);

    this.powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
  }




  render() {
    return (

      <React.Fragment>


        <Container fluid={true}>
          <Row className="App">
            <header className="App-header">
              <br />
              <h1>{this.state.AppPageTitle}</h1>
              <br />
            </header>
          </Row>
          {/* /////////////////////////////// EMBEDDING CODE SECTION HERE //////////////////////////// */}

          <Row>
            <Col sm={8} style={{ backgroundColor: '#D3D3D3' }}>
              <div style={{
                height: '70vh',
                margin: '15px',
                backgroundColor: '#D3D3D3'
              }}
                ref={(div) => {
                  if (div) {
                    this.embedContainer = div;
                  }
                }}
              />


              {this.state.appOwnsSuccess ?

                (
                  <Row>


                    <Col style={{ padding: "10px", backgroundColor: "#FFFFFF" }}>
                      <h5>Aesthetics</h5>
                      <ButtonToolbar>
                        <ButtonGroup className="mr-2" aria-label="First group">
                          <Button variant="dark" onClick={this.removeBorder}>Remove Borders</Button>
                          <Button variant="dark" onClick={() => this.toggleTransparent(this.state.toggleEmbedTransparentOff)}>Toggle Transparent Background</Button>
                          <Button variant="dark" onClick={() => this.toggleNavigationbar(this.state.toggleEmbedFilterOff)}>Toggle Navigation</Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    </Col>
                    <Col style={{ padding: "10px", backgroundColor: "#FFFFFF" }}>
                      <h5>Features</h5>
                      <ButtonToolbar>
                        <ButtonGroup className="mr-2" aria-label="First group">
                          <Button variant="dark" onClick={() => this.toggleEdit(this.state.toggleEmbedEditOff)}>Edit Mode</Button>
                          <Button variant="dark" onClick={this.fullScreen}>Full Screen</Button>
                          <Button variant="dark" onClick={this.printFeature}>Print</Button>
                          <Button variant="dark" onClick={this.handleappShow}>Mobile Layout</Button>
                        </ButtonGroup>
                      </ButtonToolbar>

                      <Modal show={this.state.appShow} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>{'Theres is a bug in Mobile Layout :('} </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You cannot create a toggle using updateSettings the same way the other functions fire. <br /><br />
                          For some odd reason, LayoutType cannot be changed between Default and Mobile Layout formats. <br /><br />
                          Recommendation is to not use updateSettings function and use embed.config instead and just re-embed at another URL.<br /><br />
                          i.e. https://webapp.com/AppOwns#mobile

                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={this.handleClose}>
                            Close
            </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>

                  </Row>
                ) : (<div style={{ backgroundColor: "#FFFFFF" }}></div>)}

            </Col>

            {/* /////////////////////////////// EMBEDDING CODE SECTION HERE //////////////////////////// */}

            <Col sm={4} >
              <Card style={{ overflow: "scroll", overflowY: "auto", maxHeight: '80vh' }}>
                <Card.Title style={{ backgroundColor: "#2C3033", color: "white", textAlign: "left" }}> <h3 style={{ marginLeft: "25px" }}>Logic</h3> </Card.Title>


                <div style={{ marginLeft: "25px" }}>
                  <h3 style={{ textDecoration: "underline" }}>1. Get PBI access token under the master account</h3>
                  Call the Power BI API, "https://analysis.windows.net/powerbi/api" using the master account. Provide a client secret as well to authenticate web apps.
                  See https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-access-token.

                  <div style={{ backgroundColor: "#F2F2F2", padding: '5px' }}>
                    <Highlight className='Javascript'>
                      {`
getAccessToken = () => {
  var url = 'https://login.microsoftonline.com/{tenantid}/oauth2/token';
  var username1 = secret.username; // Username of PowerBI "pro" account - stored in config
  var password1 = secret.password;// Password of PowerBI "pro" account - stored in config
  var clientId1 = secret.clientId;// Applicaton ID of app registered via Azure Active Directory - stored in config

  const that = this;

  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  fetch(proxyurl + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'http://localhost:3000'
    }
    ,
    body: queryString.stringify({
      grant_type: 'password',
      client_id: clientId1,
      client_secret: secret.client_secret,
      resource: 'https://analysis.windows.net/powerbi/api',
      username: username1,
      password: password1
    })
  }
  ).then(function (response) {
    return response.json();
  })
    .then(function (myJson) {

      var d = new Date(0);
      d.setUTCSeconds(myJson.expires_on);


      that.setState({
        adEmbedTokenValue: myJson.access_token,
        tokenEmbedExpiration: d
      }
      );

    });
}

`}
                    </Highlight>
                  </div>

                  <Button variant="primary" size="md" block style={{ width: '98%', marginTop: '10px', marginBottom: '10px' }} onClick={this.getAccessToken}>Get Master AD Token !</Button>
                </div>

                <Card.Body>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      style={{
                        width: '100%',
                        height: '150px',
                        overflowWrap: 'break-word'

                      }}
                      type="text"
                      placeholder="awaiting API call..."
                      value={this.state.adEmbedTokenValue}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    Token Expiry
                    <textarea
                      style={{
                        width: '100%',
                        height: '30px',
                        overflowWrap: 'break-word'

                      }}
                      type="text"
                      placeholder="awaiting API call..."
                      value={this.state.tokenadEmbedExpiration}
                      readOnly={true}
                    />
                  </div>
                </Card.Body>



                {/* ----------------------------------------- */}



                <div style={{ marginLeft: "25px" }}>
                  <h3 style={{ textDecoration: "underline" }}>2. Pass through REST API Generate Token</h3>
                  sdfaasdasdfasf

                  <div style={{ backgroundColor: "#F2F2F2", padding: '5px' }}>
                    <Highlight className='Javascript'>
                      {`getMasterGenerateToken = (masterToken, groupId, reportId) => {

var url = 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/GenerateToken';

const that = this;

var headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Bearer ' + masterToken
};

var body = {
  "accessLevel": "View"
};

fetch(url,
  {
    method: 'POST',
    headers: headers,
    body: body
  }
).then(function (response) {
  return response.json();
})
  .then(function (myJson) {
    var dt = new Date(myJson.expiration);

    that.setState({
      embedPBIToken: myJson.token,
      tokenEmbedExpiration: dt
    }
    );
  });

`}
                    </Highlight>
                  </div>

                  <Button variant="primary" size="md" block style={{ width: '98%', marginTop: '10px', marginBottom: '10px' }}
                    onClick={() => this.getMasterGenerateToken(this.state.adEmbedTokenValue, "{groupid}", "{reportid}")}
                  >
                    Get PBI Token !
                  </Button>
                </div>

                <Card.Body>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      style={{
                        width: '100%',
                        height: '150px',
                        overflowWrap: 'break-word'

                      }}
                      type="text"
                      placeholder="awaiting API call..."
                      value={this.state.embedPBIToken}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    Token Expiry
                    <textarea
                      style={{
                        width: '100%',
                        height: '30px',
                        overflowWrap: 'break-word'
                      }}
                      type="text"
                      placeholder="awaiting API call..."
                      value={this.state.tokenEmbedExpiration}
                      readOnly={true}
                    />
                  </div>
                </Card.Body>




                <div style={{ marginLeft: "25px" }}>
                  <h3 style={{ textDecoration: "underline" }}>3. Pass token into embed function</h3>
                  Now that we have a valid PBI access token, we can pass it together with a config to embed a iFrame from the Power BI API. In a real world application you would parameterise the config to take in different reports.
              <br />
                  <div style={{ backgroundColor: "#F2F2F2", padding: '5px' }}>
                    <Highlight className='Javascript'>
                      {`this.powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
                      

const config = {
    type: "report",
    tokenType: pbi.models.TokenType.Embed,
    accessToken: "H4sIAAAAAAAEACWWx87EXG5E3-XfyoByMjAL5VZLrZx3yvEqZ8Pv7s.............",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId={reportid}&groupId={groupid}",
    id: "{reportid}",
    permissions: pbi.models.Permissions.All,
    viewMode: pbi.models.ViewMode.View,
    settings: {
      localeSettings: {
        language: "en",
        formatLocale: "en-au"
      },
      filterPaneEnabled: false,
      navContentPaneEnabled: true,
      background: pbi.models.BackgroundType.Default,
      layoutType: pbi.models.LayoutType.Master


this.report = this.powerbi.embed(this.embedContainer, config);
`}
                    </Highlight>
                  </div>

                  <Button variant="primary" size="md" block style={{ width: '98%', marginTop: '10px', marginBottom: '10px' }} onClick={this.embediFrameContainer}>Embed the Content !</Button>
                </div>
                <Card.Body>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      style={{
                        width: '100%',
                        height: '30px',
                        overflowWrap: 'break-word'
                      }}
                      type="text"
                      placeholder="Awaiting API call...."
                      value={this.state.appOwnsSuccess}
                      readOnly={true}
                    />
                  </div>
                </Card.Body>







                Source:
                                                      https://docs.microsoft.com/en-us/power-bi/developer/get-azuread-access-token

              </Card>
            </Col>

          </Row>
        </Container>


      </React.Fragment>
    );
  }


  getAccessToken = () => {
    var url = 'https://login.microsoftonline.com/{tenantid}/oauth2/token';
    var username1 = secret.username; // Username of PowerBI "pro" account - stored in config
    var password1 = secret.password;// Password of PowerBI "pro" account - stored in config
    var clientId1 = secret.clientId;// Applicaton ID of app registered via Azure Active Directory - stored in config

    const that = this;

    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyurl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      }
      ,
      body: queryString.stringify({
        grant_type: 'password',
        client_id: clientId1,
        client_secret: secret.client_secret,
        resource: 'https://analysis.windows.net/powerbi/api',
        redirect_uri: 'http://localhost:3000',
        username: username1,
        password: password1
      })
    }
    ).then(function (response) {
      return response.json();
    })
      .then(function (myJson) {

        var d = new Date(0);
        d.setUTCSeconds(myJson.expires_on);


        that.setState({
          adEmbedTokenValue: myJson.access_token,
          tokenadEmbedExpiration: d
        }
        );

      });


  }



  getMasterGenerateToken = (masterToken, groupId, reportId) => {

    var url = 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/GenerateToken';

    const that = this;

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + masterToken
    };

    var body = {
      "accessLevel": "View"
    };

    fetch(url,
      {
        method: 'POST',
        headers: headers,
        body: body
      }
    ).then(function (response) {
      return response.json();
    })
      .then(function (myJson) {
        var dt = new Date(myJson.expiration);

        that.setState({
          embedPBIToken: myJson.token,
          tokenEmbedExpiration: dt
        }
        );
        console.log(JSON.stringify(myJson.token));
        console.log(JSON.stringify(myJson.expiration));
      });



  }




  embediFrameContainer = () => {
    const config = {
      type: "report",
      tokenType: pbi.models.TokenType.Embed,
      accessToken: this.state.embedPBIToken,
      embedUrl: "https://app.powerbi.com/reportEmbed?reportId={reportid}&groupId={groupid}",
      id: "{reportid}",
      permissions: pbi.models.Permissions.All,
      viewMode: pbi.models.ViewMode.View,
      settings: {
        localeSettings: {
          language: "en",
          formatLocale: "en-au"
        },
        filterPaneEnabled: false,
        navContentPaneEnabled: true,
        background: pbi.models.BackgroundType.Default,
        layoutType: pbi.models.LayoutType.Master
      }
    }

    if (this.state.embedPBIToken) {
      // this.setState({ reportEmbedded: true })
      this.report = this.powerbi.embed(this.embedContainer, config);
      this.report.off("loaded");

      this.setState({
        appOwnsSuccess: "embed successful!"
      })
    }
    else {
      this.setState({
        appOwnsSuccess: "Please generate PBI Token above first..."
      })
    }

    return this.report;
  }


  removeAppBorder = () => {
    document.querySelector('iframe[src^="https://app.powerbi.com/"]').style.border = "none";
    document.querySelector('iframe[src^="https://app.powerbi.com/"]').style.backgroundColor = "#F2F2F2";
  }


  toggleAppNavigationbar = (toggleOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleOff === "") {
      const newSettings = {
        navContentPaneEnabled: false
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleEmbedFilterOff: "yes"
      })
    }
    else {
      const newSettings = {
        navContentPaneEnabled: true
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleEmbedFilterOff: ""
      })
    }
  }

  toggleAppTransparent = (toggleTransOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleTransOff === "") {
      const newSettings = {
        background: pbi.models.BackgroundType.Transparent
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleEmbedTransparentOff: "yes"
      })
    }
    else {
      const newSettings = {
        background: pbi.models.BackgroundType.Default
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleEmbedTransparentOff: ""
      })
    }
  }


  toggleAppEdit = (toggleEmbedEditOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleEmbedEditOff === "") {
      report.switchMode("edit")
        .catch(error => { console.log(error) });
      this.setState({
        toggleEmbedEditOff: "yes"
      })
    }
    else {
      report.switchMode("view")
        .catch(error => { console.log(error) });

      this.setState({
        toggleEmbedEditOff: ""
      })
    }
  }

  appFullScreen = () => {
    var report = this.powerbi.get(this.embedContainer);
    report.fullscreen()
  }

  appPrintFeature = () => {
    var report = this.powerbi.get(this.embedContainer);
    report.print().catch(function (errors) {
      console.log(errors)
    });
  }


  handleAppClose() {
    this.setState({ appShow: false });
  }

  handleAppShow() {
    this.setState({ appShow: true });
  }




}
export default AppOwns;
