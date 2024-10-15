import React from 'react';
import { useLocation } from 'react-router-dom';

class BodyClassHandler extends React.Component {
  componentDidMount() {
    this.handleLocationChange();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.handleLocationChange();
    }
  }

  handleLocationChange() {
    if (this.props.location.pathname.startsWith('/product/')) {
      document.body.classList.add('product-details-active');
    } else {
      document.body.classList.remove('product-details-active');
    }
  }

  render() {
    return null;
  }
}

// Wrapper functional component to use useLocation
function BodyClassHandlerWrapper() {
  const location = useLocation();
  return <BodyClassHandler location={location} />;
}

export default BodyClassHandlerWrapper;