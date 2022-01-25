import { Card, Slider } from 'antd';
import _ from 'lodash';
import React from 'react';
import { profileBudgetConstants, profileValuesConstants } from '../constants';

const styledBudgetSlider = {
  marginTop: '45px',
};

const budgetFormatter = (value) => {
  return `$${value}`;
};

const getBudgetFormattedMark = (value) => {
  return { [value]: budgetFormatter(value) };
};

export const ProfileBudget = (props) => (
  <Card size="small" title="Budget" bordered={false}>
    <Slider
      range
      min={profileBudgetConstants.MIN_BUDGET}
      max={profileBudgetConstants.MAX_BUDGET}
      tipFormatter={budgetFormatter}
      tooltipVisible={true}
      marks={{
        ...getBudgetFormattedMark(profileBudgetConstants.MIN_BUDGET),
        ...getBudgetFormattedMark(profileBudgetConstants.MAX_BUDGET),
      }}
      defaultValue={[
        _.get(
          props.profile,
          profileValuesConstants.BUDGET_MIN,
          profileBudgetConstants.MIN_BUDGET
        ),
        _.get(
          props.profile,
          profileValuesConstants.BUDGET_MAX,
          profileBudgetConstants.MAX_BUDGET
        ),
      ]}
      onAfterChange={props.handleBudgetChange}
      style={styledBudgetSlider}
    />
  </Card>
);
