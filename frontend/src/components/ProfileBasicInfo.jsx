import { Card, Descriptions } from 'antd';
import _ from 'lodash';
import React from 'react';
import { userValuesConstants } from '../constants';

export const ProfileBasicInfo = (props) => (
  <Card size="small" title="Basic" bordered={false}>
    <Descriptions column={1}>
      <Descriptions.Item label="Username">
        {_.get(props.profile, userValuesConstants.USERNAME, '')}
      </Descriptions.Item>
      <Descriptions.Item label="First Name">
        {_.get(props.profile, userValuesConstants.FIRST_NAME, '')}
      </Descriptions.Item>
      <Descriptions.Item label="Last Name">
        {_.get(props.profile, userValuesConstants.LAST_NAME, '')}
      </Descriptions.Item>
    </Descriptions>
  </Card>
);
