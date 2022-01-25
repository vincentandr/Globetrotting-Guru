import { Card } from 'antd';
import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { profileActions } from '../actions';
import {
  ProfileBasicInfo,
  ProfileBudget,
  ProfileInterests,
  ProfilePlaces,
} from '../components';
import { profileBudgetConstants, profileValuesConstants } from '../constants';

class ProfilePage extends React.Component {
  componentDidMount() {
    const { base, user = {}, profile } = this.props;

    if (
      !base ||
      _.get(base, profileValuesConstants.INTERESTS, []).length == 0 ||
      _.get(base, profileValuesConstants.PLACES, []).length == 0
    ) {
      this.props.getAllAvailableValues();
    }
    if (!profile || _.isEmpty(profile)) {
      this.props.getById(user.id);
    }
  }

  handleBudgetChange = (selectedBudget) => {
    this.updateProfile(profileValuesConstants.BUDGET, {
      [profileValuesConstants.MIN]:
        _.min(selectedBudget) || profileBudgetConstants.MIN_BUDGET,
      [profileValuesConstants.MAX]:
        _.max(selectedBudget) || profileBudgetConstants.MAX_BUDGET,
    });
  };

  handleInterestsChange = (selectedInterests) => {
    this.updateProfile(profileValuesConstants.INTERESTS, selectedInterests);
  };

  handleLikedPlacesChange = (selectedLikedPlaces) => {
    const { profile } = this.props;
    this.updateProfile(profileValuesConstants.PLACES, {
      [profileValuesConstants.LIKES]: selectedLikedPlaces,
      [profileValuesConstants.DISLIKES]: _.get(
        profile,
        profileValuesConstants.PLACES_DISLIKED,
        []
      ),
    });
  };

  handleDislikedPlacesChange = (selectedDislikedPlaces) => {
    const { profile } = this.props;
    this.updateProfile(profileValuesConstants.PLACES, {
      [profileValuesConstants.LIKES]: _.get(
        profile,
        profileValuesConstants.PLACES_LIKED,
        []
      ),
      [profileValuesConstants.DISLIKES]: selectedDislikedPlaces,
    });
  };

  updateProfile = (updatedKey, updatedValue) => {
    const { profile = {} } = this.props;
    this.props.updateFullProfile({ ...profile, [updatedKey]: updatedValue });
  };

  render() {
    const { profile } = this.props;
    const loading = !profile || _.isEmpty(profile);

    return (
      <>
        <Card loading={loading} title={'Update User Profile'}>
          {loading ? null : (
            <>
              <ProfileBasicInfo {...this.props} />
              <ProfileBudget
                handleBudgetChange={this.handleBudgetChange}
                {...this.props}
              />
              <ProfileInterests
                handleInterestsChange={this.handleInterestsChange}
                {...this.props}
              />
              <ProfilePlaces
                handleLikedPlacesChange={this.handleLikedPlacesChange}
                handleDislikedPlacesChange={this.handleDislikedPlacesChange}
                {...this.props}
              />
            </>
          )}
        </Card>
      </>
    );
  }
}

function mapState(state) {
  const { authentication = {}, userProfile = {}, base = {} } = state;
  const { user } = authentication;
  const { profile } = userProfile;
  return { user, profile, base };
}

const actionCreators = {
  getById: profileActions.getById,
  getAllAvailableValues: profileActions.getAllAvailableValues,
  updateFullProfile: profileActions.updateFullProfile,
};

const connectedProfilePage = connect(mapState, actionCreators)(ProfilePage);
export { connectedProfilePage as ProfilePage };
