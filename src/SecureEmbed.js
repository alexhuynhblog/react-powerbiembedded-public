import React from 'react'
import Highlight from 'react-highlight'

const SecureEmbed = () =>
    <div>
        <header className="App-header">
            <br />
            <h1>Secure Embed Example</h1>
            <br />

            <iframe width="1140" height="541.25" src="{iframeSourcegoeshere}"></iframe>
        </header>

        <div style={{
            backgroundColor: "#F2F2F2", padding: '5px', height: '100px', width: '1140px'
        }}>
            < Highlight className='HTML, XML' >
                {`<iframe width="1140" height="541.25" src="{secure embed public publish URL}">
</iframe>`
                }
            </Highlight>
        </div>
    </div >
export default SecureEmbed