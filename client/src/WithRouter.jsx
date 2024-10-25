import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const RouterWrapper = ({ Component, ...props }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  return <Component {...props} router={{ params, navigate, location }} />;
};

class WithRouter extends React.Component {
  render() {
    const Component = this.props.WrappedComponent;
    return <RouterWrapper Component={Component} {...this.props} />;
  }
}

export function withRouter(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WithRouter WrappedComponent={WrappedComponent} {...this.props} />;
    }
  };
}

export { WithRouter };