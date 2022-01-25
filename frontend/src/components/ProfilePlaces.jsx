import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';
import { Card, Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { baseValuesConstants, profileValuesConstants } from '../constants';

const StyledPlacesCardBody = styled.div`
  && {
    display: flex;
    flex-direction: column;
  }
`;
const styledPlacesGrid = {
  width: '100%',
  textAlign: 'center',
};

export const ProfilePlaces = (props) => {
  const { profile, base } = props;
  const availablePlaces = _.get(base, baseValuesConstants.PLACES, []);
  const selectedLikedPlaces = _.get(
    profile,
    profileValuesConstants.PLACES_LIKED,
    []
  );
  const selectedDislikedPlaces = _.get(
    profile,
    profileValuesConstants.PLACES_DISLIKED,
    []
  );

  return (
    <Card size="small" title="Places" bordered={false}>
      <StyledPlacesCardBody>
        <Card.Grid style={styledPlacesGrid}>
          Likes <LikeOutlined />
          <Select
            mode="multiple"
            value={selectedLikedPlaces}
            onChange={props.handleLikedPlacesChange}
            style={{ width: '100%' }}
          >
            {availablePlaces
              .filter(
                (i) =>
                  !selectedLikedPlaces.includes(i) &&
                  !selectedDislikedPlaces.includes(i)
              )
              .map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
          </Select>
        </Card.Grid>
        <Card.Grid style={styledPlacesGrid}>
          Dislikes <DislikeOutlined />
          <Select
            mode="multiple"
            value={selectedDislikedPlaces}
            onChange={props.handleDislikedPlacesChange}
            style={{ width: '100%' }}
            placement="bottomCenter"
          >
            {availablePlaces
              .filter(
                (i) =>
                  !selectedLikedPlaces.includes(i) &&
                  !selectedDislikedPlaces.includes(i)
              )
              .map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
          </Select>
        </Card.Grid>
      </StyledPlacesCardBody>
    </Card>
  );
};
