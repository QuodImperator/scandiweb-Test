import React from 'react';
import './index.css';
import Header from './Header.jsx';
import ProductGrid from './Products.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryChangeHandler: null
    };
  }

  setCategoryChangeHandler = (handler) => {
    this.setState({ categoryChangeHandler: handler });
  }

  render() {
    return (
      <div>
        <Header onCategoryChange={this.state.categoryChangeHandler} />
        <ProductGrid onCategoryChange={this.setCategoryChangeHandler} />
      </div>
    );
  }
}

export default App;