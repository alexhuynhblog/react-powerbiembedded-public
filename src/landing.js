import React from 'react'
const LandingPage = () =>
    <header className="App-header">
        <br />
        <h1 style={{ marginLeft: '20px' }}>Setup</h1>
        <br />

        <p style={{ padding: '25px', fontSize: '30px' }}>
            <b>
                <ul>1. App registration</ul>
                <ul>2. Grant base API permissions - Azure AD and Power BI API</ul>
                <ul>3. Implicit flow turn on</ul>
                <ul>4. Azure Admin must approve the api permissions requested</ul>



            </b>
            <br></br><br></br>
            This demo has a showcase for:
            <li>Secure Embedded</li>
            <li>User Owns Data</li>
            <li>App Owns Data</li>
            <li>Single Visual Embedding</li>

            <br></br><br></br>
            Created by Alex Huynh using create-react-app & react bootstrap


        </p>
    </header>
export default LandingPage