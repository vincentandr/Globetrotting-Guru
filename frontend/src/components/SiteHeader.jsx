import { Layout, Menu } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { routeConstants } from '../constants';
import { getLoggedInUser, isMobileOrTablet } from '../helpers';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  && {
    width: 100%;
  }
`;

class SiteHeader extends React.Component {
  render() {
    const { loggedIn } = this.props;

    return (
      <StyledHeader>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[window.location.pathname]}
        >
          {Object.values(routeConstants)
            .filter((route) =>
              route.showInHeader(getLoggedInUser() && loggedIn)
            )
            .map((route) => (
              <Menu.Item key={route.path}>
                <Link to={route.path}>{route.label}</Link>
              </Menu.Item>
            ))}
        </Menu>
      </StyledHeader>
    );
  }
}

function mapState(state) {
  const { authentication = {} } = state;
  const { loggedIn } = authentication;
  return { loggedIn };
}

const connectedSiteHeader = connect(mapState)(SiteHeader);
export { connectedSiteHeader as SiteHeader };
