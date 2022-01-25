import { Card, Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import { baseValuesConstants, profileValuesConstants } from '../constants';

export const ProfileInterests = (props) => {
  const { profile, base } = props;
  const availableInterests = _.get(base, baseValuesConstants.INTERESTS, []);
  const selectedInterests = _.get(
    profile,
    profileValuesConstants.INTERESTS,
    []
  );

  return (
    <Card size="small" title="Interests" bordered={false}>
      <Select
        mode="multiple"
        value={selectedInterests}
        onChange={props.handleInterestsChange}
        style={{ width: '100%' }}
        placement="bottomCenter"
      >
        {availableInterests
          .filter((i) => !selectedInterests.includes(i))
          .map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
      </Select>
    </Card>
  );
};
