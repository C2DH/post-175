import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const withRouter = (Component) => {
  const Wrapped = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    const history = {
      push: (to, state) => navigate(to, { state }),
      replace: (to, state) => navigate(to, { replace: true, state }),
      goBack: () => navigate(-1),
    }

    return (
      <Component
        {...props}
        location={location}
        params={params}
        history={history}
      />
    )
  }

  Wrapped.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}

export default withRouter
