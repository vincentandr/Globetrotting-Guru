import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  notificationConstants,
  DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS,
} from '../constants';
import { Button, Spin, Form, Input, message } from 'antd';
import styled from 'styled-components';
import { userActions } from '../actions';

const StyledRegisterButton = styled(Button)`
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

class RegisterPage extends React.Component {
  onSubmit = (values) => {
    const { first_name, last_name, username, password } = values;
    if (first_name && last_name && username && password) {
      this.props.register({ first_name, last_name, username, password });
    }
  };

  onError = () =>
    message.error(
      notificationConstants.VALIDATION_ERROR,
      DEFAULT_NOTIFICATION_DISPLAY_DURATION_SECONDS
    );

  render() {
    const { registering } = this.props;

    return (
      <Form
        {...formLayout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onSubmit}
        onFinishFailed={this.onError}
      >
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[
            {
              required: true,
              message: 'First name required.',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
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
          <StyledRegisterButton type="primary" htmlType="submit">
            Register
          </StyledRegisterButton>
          {registering && <Spin />}
        </Form.Item>
      </Form>
    );
  }
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register,
};

const connectedRegisterPage = connect(mapState, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };
