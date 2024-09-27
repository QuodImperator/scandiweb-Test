import React from 'react';
import './index.css';
import Header from './Header.jsx';
import ProductGrid from './Products.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'women'
    };
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  }

  render() {
    return (
      <div className="App">
        <Header onCategoryChange={this.handleCategoryChange} />
        <ProductGrid activeCategory={this.state.activeCategory} />
      </div>
    );
  }
}

export default App;