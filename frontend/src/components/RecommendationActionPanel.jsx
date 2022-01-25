import {
  faLightbulb,
  faHeartBroken,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Tooltip } from 'antd';
import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

const StyledRecommendationButton = styled(Button)`
  && {
    width: 180px;
    margin-right: 6px;
  }
`;

const StyledFeedbackButton = styled(Button)`
  && {
    margin: 0px 12px;
  }
`;

export const RecommendationActionPanel = (props) => {
  const {
    user,
    fetchingRecommendation,
    fetchNewRecommendation,
    handleFeedback,
  } = props;
  return (
    <Row justify="center">
      {user && !_.isEmpty(user) ? (
        <StyledFeedbackButton
          type="primary"
          shape="circle"
          icon={<FontAwesomeIcon icon={faHeartBroken} size="lg" />}
          onClick={() => handleFeedback(false)}
        />
      ) : null}
      <Tooltip title="Show me another recommendation!" placement="bottom">
        <StyledRecommendationButton
          type="primary"
          shape="round"
          icon={
            <FontAwesomeIcon
              icon={faLightbulb}
              size="lg"
              style={{ marginRight: '6px' }}
            />
          }
          loading={fetchingRecommendation}
          onClick={fetchNewRecommendation}
        >
          {fetchingRecommendation ? 'Fetching new...' : 'What next?'}
        </StyledRecommendationButton>
      </Tooltip>
      {user && !_.isEmpty(user) ? (
        <StyledFeedbackButton
          type="primary"
          shape="circle"
          icon={<FontAwesomeIcon icon={faHeart} size="lg" />}
          onClick={() => handleFeedback(true)}
        />
      ) : null}
    </Row>
  );
};
