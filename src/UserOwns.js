import React from 'react';
import { Container, Row, Col, Card, ButtonToolbar, ButtonGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getAdalToken, authContext } from './adalConfig';
import Highlight from 'react-highlight'
import jwt_decode from 'jwt-decode';
import * as pbi from 'powerbi-client';

class UserOwns extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      PageTitle: "User-Owns-Data Approach",
      adTokenValue: "",
      embedToken: "",
      tokenExpiration: "",
      userOwnsSuccess: "",
      toggleFilterOff: "",
      toggleTransparentOff: "",
      toggleEditOff: "",
      toggleMobileOff: "",
      show: false
    }

    this.embediFrameContainer = this.embediFrameContainer.bind(this);
    this.buttonADTokenCall = this.buttonADTokenCall.bind(this);
    this.getPowerBIToken = this.getPowerBIToken.bind(this);
    this.removeBorder = this.removeBorder.bind(this);
    this.toggleNavigationbar = this.toggleNavigationbar.bind(this);
    this.toggleTransparent = this.toggleTransparent.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.fullScreen = this.fullScreen.bind(this);
    this.printFeature = this.printFeature.bind(this);
    this.mobileLayout = this.mobileLayout.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
  }

  buttonADTokenCall() {
    this.setState({
      adTokenValue: getAdalToken()
    })
  }


  render() {
    return (

      <React.Fragment>


        <Container fluid={true}>
          <Row className="App">
            <header className="App-header">
              <br />
              <h1>{this.state.PageTitle}</h1>
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


              {this.state.userOwnsSuccess ?

                (
                  <Row>


                    <Col style={{ padding: "10px", backgroundColor: "#FFFFFF" }}>
                      <h5>Aesthetics</h5>
                      <ButtonToolbar>
                        <ButtonGroup className="mr-2" aria-label="First group">
                          <Button variant="dark" onClick={this.removeBorder}>Remove Borders</Button>
                          <Button variant="dark" onClick={() => this.toggleTransparent(this.state.toggleTransparentOff)}>Toggle Transparent Background</Button>
                          <Button variant="dark" onClick={() => this.toggleNavigationbar(this.state.toggleFilterOff)}>Toggle Navigation</Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    </Col>
                    <Col style={{ padding: "10px", backgroundColor: "#FFFFFF" }}>
                      <h5>Features</h5>
                      <ButtonToolbar>
                        <ButtonGroup className="mr-2" aria-label="First group">
                          <Button variant="dark" onClick={this.fullScreen}>Full Screen</Button>
                          <Button variant="dark" onClick={this.printFeature}>Print</Button>
                          <Button variant="dark" onClick={() => this.toggleEdit(this.state.toggleEditOff)}>Edit Mode</Button>
                          <Button variant="dark" onClick={this.handleShow}>Mobile Layout</Button>
                        </ButtonGroup>
                      </ButtonToolbar>

                      <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>{'Theres is a bug in Mobile Layout :('} </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You cannot create a toggle using updateSettings the same way the other functions fire. <br /><br />
                          For some odd reason, LayoutType cannot be changed between Default and Mobile Layout formats. <br /><br />
                          Recommendation is to not use updateSettings function and use embed.config instead and just re-embed at another URL.<br /><br />
                          i.e. https://webapp.com/UserOwns#mobile

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
                  <h3 style={{ textDecoration: "underline" }}>Create AuthContext object in react-adal</h3>
                  We can get this from ADAL libraries which returns a JWT token from <br />"authorityUri: https://login.microsoftonline.com/".
                  The call below just proves we have an ADAL connection.
              <br />
                  <div style={{ backgroundColor: "#F2F2F2", padding: '5px' }}>
                    <Highlight className='Javascript'>
                      {`import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

const adalConfig = {
          tenant: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          clientId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          ....
          }

const authContext = new AuthenticationContext(adalConfig);
return AzureADToken = authContext.getCachedToken(authContext.config.clientId); 
`}
                    </Highlight>
                  </div>
                  <Button variant="primary" size="md" block style={{ width: '98%', marginTop: '10px', marginBottom: '10px' }} onClick={this.buttonADTokenCall} >Show cached user Token !</Button>

                </div>
                <Card.Body>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <textarea
                      style={{
                        width: '100%',
                        height: '50px',
                        overflowWrap: 'break-word'
                      }}
                      type="text"
                      placeholder="Just to prove there is a connection to Azure AD. Populate with token..."
                      value={this.state.adTokenValue}
                      readOnly={true}
                    />
                  </div>
                </Card.Body>


                <div style={{ marginLeft: "25px" }}>
                  <h3 style={{ textDecoration: "underline" }}>2. Get access token</h3>
                  Using the react-adal library from above, call a token using authContext against the Power BI API, "https://analysis.windows.net/powerbi/api".

                  <div style={{ backgroundColor: "#F2F2F2", padding: '5px' }}>
                    <Highlight className='Javascript'>
                      {`authContext.acquireToken("https://analysis.windows.net/powerbi/api", function (error, AADtoken) {

  if (error || !AADtoken) {
    console.log("ADAL Error Occurred: " + error);
  }

  if (AADtoken) {
    var expiry = jwt_decode(AADtoken).exp;
    var date = new Date(0);
    date.setUTCSeconds(expiry);

      embedToken: AADtoken,
      tokenExpiration: date
`}
                    </Highlight>
                  </div>

                  <Button variant="primary" size="md" block style={{ width: '98%', marginTop: '10px', marginBottom: '10px' }} onClick={this.getPowerBIToken}>Get PBI Token !</Button>
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
                      value={this.state.embedToken}
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
                      value={this.state.tokenExpiration}
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
    tokenType: pbi.models.TokenType.Aad,
    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0ZlFDOE.........",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId={reportid}&groupId={groupid}",
    id: "{reportid}",
    permissions: pbi.models.Permissions.All,//Read,
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
                      value={this.state.userOwnsSuccess}
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



  getPowerBIToken = () => {
    var self = this;

    authContext.acquireToken("https://analysis.windows.net/powerbi/api", function (error, AADtoken) {

      if (error || !AADtoken) {
        console.log("ADAL Error Occurred: " + error);
      }

      if (AADtoken) {
        var expiry = jwt_decode(AADtoken).exp;
        var date = new Date(0);
        date.setUTCSeconds(expiry);

        //console.log("New expiry: " + date);

        self.setState({
          embedToken: AADtoken,
          tokenExpiration: date
        });

      }

    });

  }


  embediFrameContainer = () => {
    const config = {
      type: "report",
      tokenType: pbi.models.TokenType.Aad,
      accessToken: this.state.embedToken,
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

    if (this.state.embedToken) {
      // this.setState({ reportEmbedded: true })
      this.report = this.powerbi.embed(this.embedContainer, config);
      this.report.off("loaded");

      this.setState({
        userOwnsSuccess: "embed successful!"
      })
    }
    else {
      this.setState({
        userOwnsSuccess: "Please generate PBI Token above first..."
      })
    }

    return this.report;
  }


  removeBorder = () => {
    document.querySelector('iframe[src^="https://app.powerbi.com/"]').style.border = "none";
    document.querySelector('iframe[src^="https://app.powerbi.com/"]').style.backgroundColor = "#F2F2F2";
  }


  toggleNavigationbar = (toggleOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleOff === "") {
      const newSettings = {
        navContentPaneEnabled: false
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleFilterOff: "yes"
      })
    }
    else {
      const newSettings = {
        navContentPaneEnabled: true
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleFilterOff: ""
      })
    }
  }

  toggleTransparent = (toggleTransOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleTransOff === "") {
      const newSettings = {
        background: pbi.models.BackgroundType.Transparent
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleTransparentOff: "yes"
      })
    }
    else {
      const newSettings = {
        background: pbi.models.BackgroundType.Default
      };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });

      this.setState({
        toggleTransparentOff: ""
      })
    }
  }


  toggleEdit = (toggleEditOff) => {
    var report = this.powerbi.get(this.embedContainer);

    if (toggleEditOff === "") {
      report.switchMode("edit")
        .catch(error => { console.log(error) });
      this.setState({
        toggleEditOff: "yes"
      })
    }
    else {
      report.switchMode("view")
        .catch(error => { console.log(error) });

      this.setState({
        toggleEditOff: ""
      })
    }
  }

  fullScreen = () => {
    var report = this.powerbi.get(this.embedContainer);
    report.fullscreen()
  }

  printFeature = () => {
    var report = this.powerbi.get(this.embedContainer);
    report.print().catch(function (errors) {
      console.log(errors)
    });
  }

  mobileLayout = (toggleMobileOff) => {
    var report = this.powerbi.get(this.embedContainer);
    // var newLayout = pbi.models.LayoutType.Custom;
    //  if (toggleMobileOff === "") {

    var newLayout = pbi.models.LayoutType.MobilePortrait;

    console.log(report.config.settings.layoutType + " this is current")

    report.getPages().then(function (pages) {
      pages[0].hasLayout(pbi.models.LayoutType.MobilePortrait).then(function (hasLayout) {
        console.log(hasLayout + ' has MobilePortrait?');
        console.log(newLayout);
      })
    });

    if (report.config.settings.layoutType !== newLayout) {
      const newSettings = { layoutType: newLayout };
      report.updateSettings(newSettings)
        .catch(error => { console.log(error) });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }




}


export default UserOwns;
