import { Layout } from 'antd';
import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { PrivateRoute, PublicOnlyRoute, SiteHeader } from '../components';
import { routeConstants } from '../constants';
import { history } from '../helpers';
import './App.css';
import { isMobileOrTablet, isSmallDesktop } from '../helpers';
import _ from 'lodash';
import { HomePage, LoginPage, RegisterPage, ProfilePage } from '../pages';

const { Content } = Layout;

const AppLayout = styled(Layout)`
  && {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    display: flex;
    height: 100%;
    min-height: 100%;
    flex-direction: column;
    background: white;
  }
`;

const StyledContent = styled(Content)`
  && {
    padding: 30px 25%;
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 480px) {
    font: 3em;
  }
`;

const getContainerPadding = () => {
  if (isMobileOrTablet()) {
    return '12px 24px';
  } else if (isSmallDesktop()) {
    return '30px 10%';
  }
  return '30px 25%';
};

class App extends React.Component {
  handleResize = _.throttle(() => {
    console.log(window.innerHeight + ' ' + window.innerWidth);
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  }, 500);

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <>
        <AppLayout>
          <Router history={history}>
            <Route path="*" component={SiteHeader} />
            <StyledContent style={{ padding: getContainerPadding() }}>
              <Switch>
                <Route
                  exact
                  path={routeConstants.HOME.path}
                  component={HomePage}
                />
                <PublicOnlyRoute
                  path={routeConstants.LOGIN.path}
                  component={LoginPage}
                />
                <PublicOnlyRoute
                  path={routeConstants.REGISTER.path}
                  component={RegisterPage}
                />
                <PrivateRoute
                  path={routeConstants.PROFILE.path}
                  component={ProfilePage}
                />
                <Redirect from="*" to={routeConstants.HOME.path} />
              </Switch>
            </StyledContent>
          </Router>
        </AppLayout>
      </>
    );
  }
}

export { App };
