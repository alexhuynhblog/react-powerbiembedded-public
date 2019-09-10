import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import * as pbi from 'powerbi-client';
import { getAdalToken, authContext } from './adalConfig';
import Highlight from 'react-highlight'

class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            GenerateExample: "",
            singleAADtoken: "",
            embedded: ""
        }

        this.powerbi = new pbi.service.Service(
            pbi.factories.hpmFactory,
            pbi.factories.wpmpFactory,
            pbi.factories.routerFactory
        );

        this.generateClick = this.generateClick.bind(this);
        this.getPowerBIToken = this.getPowerBIToken.bind(this);
        this.embediFrameContainer = this.embediFrameContainer.bind(this);
    }

    generateClick = () => {

        this.getPowerBIToken()
        this.embediFrameContainer()
        this.setState({
            GenerateExample: 'yes'
        }
        )
    }


    getPowerBIToken = () => {
        var self = this;

        authContext.acquireToken("https://analysis.windows.net/powerbi/api", function (error, AADtoken) {

            if (error || !AADtoken) {
                console.log("ADAL Error Occurred: " + error);
            }

            if (AADtoken) {

                self.setState({
                    singleAADtoken: AADtoken
                });

            }

        });

    }


    embediFrameContainer = () => {
        const config = {
            type: "visual",
            tokenType: pbi.models.TokenType.Aad,
            accessToken: this.state.singleAADtoken,
            embedUrl: "https://app.powerbi.com/reportEmbed?reportId={reportid}&groupId={groupid}",
            id: "{reportid}",
            pageName: "{pageName/reportSection}",
            visualName: "{visualid}",
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

        if (this.state.singleAADtoken) {
            this.report = this.powerbi.embed(this.embedContainer, config);
            this.report.off("loaded");

            this.setState({
                embedded: "embed successful!"
            })
        }
        else {

        }

        return this.report;
    }



    render() {
        return (
            <React.Fragment>
                <Button variant="dark" style={{ margin: '5px' }} onClick={this.generateClick}>Generate Example</Button>


                <Container fluid={true}>
                    {this.state.GenerateExample && this.state.singleAADtoken ?

                        (
                            <>
                                <Row className="App">
                                    <header className="App-header">
                                        <br />
                                        <h1>Pizza Planet Sales Team</h1>
                                        <br />
                                    </header>
                                </Row>
                                <Row>
                                    <Col sm={5} style={{ backgroundColor: '#343A40', height: '70vh' }}>
                                        <h1 style={{ color: 'white' }}>Perth Store</h1>
                                        <div style={{
                                            height: '50vh',
                                            margin: '15px',
                                            backgroundColor: '#D3D3D3'
                                        }}
                                            ref={(div) => {
                                                if (div) {
                                                    this.embedContainer = div;
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col sm={7} style={{ backgroundColor: '#D3D3D3' }}>  <h2>Location </h2>
                                        123 William St, Northbridge
                                        Ph: 0430 123 123 <br></br>
                                        <Button>Call them</Button> <Button>Tell em' what type of cheese they're getting next week</Button>
                                        <br></br><br></br>
                                        Manchego bavarian bergkase cheese strings. Ricotta manchego mozzarella halloumi roquefort cauliflower cheese cut the cheese cheeseburger. Stinking bishop cut the cheese cauliflower cheese boursin camembert de normandie emmental cheesecake feta. Croque monsieur fromage frais the big cheese croque monsieur brie mascarpone.
Pecorino roquefort cheddar. Stilton cheese triangles pepper jack cow taleggio feta croque monsieur goat. Cauliflower cheese mascarpone dolcelatte camembert de normandie cheddar cheese strings cheese strings squirty cheese. Croque monsieur paneer jarlsberg.
<br></br><br></br> Mascarpone cheese slices say cheese. Cheddar bocconcini when the cheese comes out everybody's happy brie who moved my cheese pecorino squirty cheese macaroni cheese. Manchego when the cheese comes out everybody's happy fromage frais queso manchego halloumi blue castello lancashire. Cheesy grin.
                                        
                                        
<div style={{ backgroundColor: "#F2F2F2"}}><Highlight className='Javascript'>{`const config = {
            type: "visual",
            tokenType: pbi.models.TokenType.Aad,
            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0ZlFDOE.........',
            embedUrl: "https://app.powerbi.com/reportEmbed?reportId={reportid}&groupId={groupid}",
            id: "{reportid}",
            pageName: "{pageName/reportSection}",
            visualName: "{visualName}",
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
        }`}</Highlight>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        ) : (<div style={{ backgroundColor: "#FFFFFF" }}></div>)}
                </Container>

            </React.Fragment>
        )
    }
}
export default LandingPage