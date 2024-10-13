import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/a-logo.png';
import cart from './assets/EmptyCart.png';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'all',
    };
  }

  handleClick = (tab, categoryId) => {
    this.setState({ activeTab: tab });
    if (this.props.onCategoryChange) {
      this.props.onCategoryChange(categoryId);
    }
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <ul>
          <li>
            <Link
              to="/"
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => this.handleClick('all', 'all')}
            >
              ALL
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={`nav-link ${activeTab === 'clothes' ? 'active' : ''}`}
              onClick={() => this.handleClick('clothes', '2')}
            >
              CLOTHES
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={`nav-link ${activeTab === 'tech' ? 'active' : ''}`}
              onClick={() => this.handleClick('tech', '3')}
            >
              TECH
            </Link>
          </li>
          <li>
            <img src={logo} alt="Logo" className="logo" />
          </li>
          <li>
            <Link to="/" className="cart-link">
              <img src={cart} alt="Cart" className="cart" />
            </Link>
          </li>
        </ul>

        <div className="category-display">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>
      </div>
    );
  }
}

export default Header;