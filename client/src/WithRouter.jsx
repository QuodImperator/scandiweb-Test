import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function WithRouterWrapper(Component) {
  return function ComponentWithRouter(props) {
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();
    
    return (
      <Component
        {...props}
        router={{ params, navigate, location }}
      />
    );
  };
}

export function WithRouter(WrappedComponent) {
  return WithRouterWrapper(WrappedComponent);
}

export default WithRouter;