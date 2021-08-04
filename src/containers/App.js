
import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import Modal from 'components/Modal'

function App(props) {
    return (
        <Modal>
            {/* render sub routes */}
            {renderRoutes(props.route.routes)}
        </Modal>
    )
}

export default App


