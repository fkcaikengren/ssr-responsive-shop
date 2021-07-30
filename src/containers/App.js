
import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'

function App(props) {
    
    return (
        <Fragment>
            {renderRoutes(props.route.routes)}
        </Fragment>
    )
}

export default App


