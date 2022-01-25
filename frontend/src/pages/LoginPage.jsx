import React from 'react';
import { Button, Spin, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  notificationConstants,
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
} from '../constants';
import { userActions } from '../actions';

const StyledLoginButton = styled(Button)`
  && {
    margin-right: 10px;
  }
`;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const formTailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class LoginPage extends React.Component {
  onSubmit = (values) => {
    const { username, password } = values;
    if (username && password) {
      this.props.login(username, password);
    }
  };

  onError = () =>
    message.error(
      notificationConstants.VALIDATION_ERROR,
      DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
    );

  render() {
    const { loggingIn } = this.props;

    return (
      <Form
        {...formLayout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onSubmit}
        onFinishFailed={this.onError}
      >
        <Form.Item
          label="Email Address"
          name="username"
          rules={[
            {
              required: true,
              message: 'Username (valid email address) required.',
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password required.' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <StyledLoginButton type="primary" htmlType="submit">
            Login
          </StyledLoginButton>
          {loggingIn && <Spin />}
        </Form.Item>
      </Form>
    );
  }
}

function mapState(state) {
  const { loggingIn } = state.authentication;
  return { loggingIn };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };
