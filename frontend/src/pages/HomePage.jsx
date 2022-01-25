import { Divider, message, Skeleton } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { profileActions, recommendationActions, userActions } from '../actions';
import {
  RecommendationActionPanel,
  RecommendationCard,
  RecommendationImageUpload,
} from '../components';
import {
  notificationConstants,
  profileValuesConstants,
  recommendationValuesConstants,
} from '../constants';

const StyledHeader = styled.div`
  && {
    margin-bottom: 12px;
  }
`;

const StyledTitle = styled.h2`
  && {
    margin-bottom: 0px;
  }
`;

const StyledImageSkeleton = styled(Skeleton)`
  && {
    width: 100%;
  }
`;

class HomePage extends React.Component {
  componentDidMount() {
    const { recommendation } = this.props;

    if (!recommendation || _.isEmpty(recommendation)) {
      this.fetchNewRecommendation();
    }
  }

  fetchNewRecommendation = () => {
    const { user } = this.props;

    user
      ? this.props.getRecommendationByProfile(user.id)
      : this.props.getRandomRecommendation();
  };

  handleFeedback = (isPositive) => {
    const { user, profile = {}, recommendation } = this.props;

    if (
      user &&
      !_.isEmpty(user) &&
      recommendation &&
      !_.isEmpty(recommendation)
    ) {
      const updateIn = isPositive
        ? profileValuesConstants.PLACES_LIKED
        : profileValuesConstants.PLACES_DISLIKED;
      const removeFrom = isPositive
        ? profileValuesConstants.PLACES_DISLIKED
        : profileValuesConstants.PLACES_LIKED;
      //Add selection to liked place, remove it from dislike places if it exists (will not need this complexity once we have actual BE apis)
      const newProfile = _.set(
        _.set(
          {
            id: user.id,
            ...profile,
          },
          updateIn,
          _.union([
            ..._.get(profile, updateIn, []),
            _.get(recommendation, recommendationValuesConstants.NAME),
          ])
        ),
        removeFrom,
        _.union([
          ..._.get(profile, removeFrom, []).filter(
            (place) =>
              place !==
              _.get(recommendation, recommendationValuesConstants.NAME)
          ),
        ])
      );
      this.props.updateFullProfile(newProfile);
      this.fetchNewRecommendation();
    }
  };

  render() {
    const { user, recommendation } = this.props;

    return (
      <>
        <StyledHeader>
          <StyledTitle>
            Hello{user && !_.isEmpty(user) ? ' ' + user.first_name : ''}!
          </StyledTitle>
          {user && !_.isEmpty(user) ? (
            <a
              onClick={() => {
                this.props.logout();
                message.success(notificationConstants.LOGGED_OUT);
              }}
            >
              Logout
            </a>
          ) : null}
        </StyledHeader>
        <Divider style={{ margin: '0px' }} />
        {recommendation && !_.isEmpty(recommendation) ? (
          <>
            <RecommendationCard {...this.props} />
            <RecommendationActionPanel
              fetchNewRecommendation={this.fetchNewRecommendation}
              handleFeedback={this.handleFeedback}
              {...this.props}
            />
            <Divider />
            <RecommendationImageUpload />
          </>
        ) : (
          <StyledImageSkeleton
            active={true}
            size="large"
            round={true}
            paragraph={{ rows: 16 }}
          />
        )}
      </>
    );
  }
}

function mapState(state) {
  const { users, authentication, userProfile = {}, recommendation } = state;
  const { user } = authentication;
  const { profile } = userProfile;
  const { fetchingRecommendation } = recommendation;
  return {
    user,
    users,
    profile,
    recommendation: _.get(recommendation, 'recommendation', {}),
    fetchingRecommendation,
  };
}

const actionCreators = {
  logout: userActions.logout,
  getRandomRecommendation: recommendationActions.getRandomRecommendation,
  getRecommendationByProfile: recommendationActions.getRecommendationByProfile,
  updateFullProfile: profileActions.updateFullProfile,
};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };
