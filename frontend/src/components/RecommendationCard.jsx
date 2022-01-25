import {
  faCar,
  faCloudSunRain,
  faStar,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Carousel, Col, Comment, Divider, Row } from 'antd';
import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { recommendationValuesConstants } from '../constants';
import { recommendation } from '../reducers/Recommendation';
import { isMobile, isMobileOrTablet, isSmallDesktop } from '../helpers';

const StyledCarouselCard = styled(Card)`
  && {
    margin-bottom: 12px;
  }
  && .ant-card-head {
    padding: 0px;
    text-align: center;
  }
  && .ant-card-body {
    padding: 0px;
    overflow: hidden;
    border-radius: 10px;

    /* i cri */
    @media only screen and (min-width: 640px) {
      height: 350px;
    }
    @media only screen and (min-width: 920px) {
      height: 400px;
    }
    @media only screen and (min-width: 1200px) {
      height: 350px;
    }
    @media only screen and (min-width: 1500px) {
      height: 420px;
    }
    @media only screen and (min-width: 1700px) {
      height: 500px;
    }
  }
`;

const StyledMobileCarouselCard = styled(Card)`
  && {
    margin-bottom: 12px;
  }
  && .ant-card-head {
    padding: 0px;
    text-align: center;
  }
  && .ant-card-body {
    padding: 0px;
    overflow: hidden;
    border-radius: 10px;
  }
`;

const StyledTextOnlyCard = styled(Card)`
  && .ant-card-head {
    padding: 0px;
    text-align: center;
  }
`;

const StyledCarousel = styled(Carousel)`
  && {
    width: 100%;
    height: 100%;
  }
`;

const StyledMobileCarousel = styled(Carousel)`
  && {
    width: 100%;
    overflow: hidden;

    /* i cri */
    @media only screen and (max-width: 400px) {
      height: 160px;
    }
    @media only screen and (min-width: 400px) {
      height: 220px;
    }
    @media only screen and (min-width: 520px) {
      height: 270px;
    }
  }
`;

const StyledFigure = styled.figure`
  && {
    background-color: black;
    width: 100%;
    height: 100%;
    margin: 0px;
  }
  &:hover {
    @media only screen and (min-width: 720px) {
      img {
        opacity: 0.2;
      }
      div {
        opacity: 1;
      }
    }
  }
`;

const StyledImage = styled.img`
  && {
    width: 100%;
    height: 100%;

    opacity: 1;
    display: block;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }
`;

const StyledCarouselDescriptionBody = styled.div`
  padding: 12px 30px;
  color: white;

  transition: 0.5s ease-in 0.5s ease-out;
  opacity: 0;
  top: 5%;
  left: 0%;
  position: absolute;
`;

const StyledDescriptionBody = styled.div`
  padding: 12px 30px;
`;

const StyledRecommendationFeature = styled(Col)`
  margin-top: 12px;
`;

const budgetFormatter = (value) => {
  return `$${value}`;
};

const getFeatureIconSpan = () => {
  if (isMobileOrTablet()) {
    return 4;
  }
  return 2;
};

const getFeatureDescriptionSpan = () => {
  if (isMobile()) {
    return 20;
  } else if (isMobileOrTablet()) {
    return 8;
  }
  return 6;
};

const getNumberOfRecommendationsDisplayed = () => {
  if (isSmallDesktop()) {
    return 2;
  } 
  return 1;
}

const getImageDescription = (recommendation) => (
  <>
    <Row>
      {_.get(recommendation, recommendationValuesConstants.DESCRIPTION)}
    </Row>
    <Row justify="center" style={{ margin: '8px 16px' }}>
      <StyledRecommendationFeature span={getFeatureIconSpan()}>
        <FontAwesomeIcon icon={faCloudSunRain} size="lg" />
      </StyledRecommendationFeature>
      <StyledRecommendationFeature span={getFeatureDescriptionSpan()}>
        {_.get(recommendation, recommendationValuesConstants.WEATHER)}
      </StyledRecommendationFeature>
      <StyledRecommendationFeature span={getFeatureIconSpan()}>
        <FontAwesomeIcon icon={faCar} size="lg" />
      </StyledRecommendationFeature>
      <StyledRecommendationFeature span={getFeatureDescriptionSpan()}>
        {_.get(recommendation, recommendationValuesConstants.TRAFFIC)}
      </StyledRecommendationFeature>
      <StyledRecommendationFeature span={getFeatureIconSpan()}>
        <FontAwesomeIcon icon={faMoneyBillWave} size="lg" />
      </StyledRecommendationFeature>
      <StyledRecommendationFeature span={getFeatureDescriptionSpan()}>
        {_.get(recommendation, recommendationValuesConstants.BUDGET, [])
          .length == 2
          ? budgetFormatter(
              _.get(recommendation, recommendationValuesConstants.BUDGET)[0]
            ) +
            ' - ' +
            budgetFormatter(
              _.get(recommendation, recommendationValuesConstants.BUDGET)[1]
            )
          : '-'}
      </StyledRecommendationFeature>
    </Row>
    <Divider style={{ margin: '12px 0px' }} />
    <Row>
      {_.slice(
        _.get(recommendation, recommendationValuesConstants.REVIEWS, []),
        0,
        getNumberOfRecommendationsDisplayed()
      ).map((review) => (
        <Comment
          key={review.text}
          actions={[...Array(review.score).keys()].map((idx) => (
            <FontAwesomeIcon key={idx} icon={faStar} size="lg" color="yellow" />
          ))}
          content={<p style={{ fontStyle: 'italic' }}>...{review.text}</p>}
        />
      ))}
    </Row>
  </>
);

export const RecommendationCard = (props) => {
  const { recommendation } = props;

  if (
    _.get(recommendation, recommendationValuesConstants.IMAGES, []).length == 0
  ) {
    return (
      <StyledTextOnlyCard
        title={_.get(recommendation, recommendationValuesConstants.NAME)}
        bordered={false}
      >
        {getImageDescription(recommendation)}
      </StyledTextOnlyCard>
    );
  } else if (isMobileOrTablet()) {
    return (
      <StyledMobileCarouselCard
        title={_.get(recommendation, recommendationValuesConstants.NAME)}
        bordered={false}
      >
        <StyledMobileCarousel autoplay effect="fade">
          {_.get(recommendation, recommendationValuesConstants.IMAGES, []).map(
            (imageSrc) => (
              <StyledFigure key={imageSrc}>
                <StyledImage src={imageSrc} />
              </StyledFigure>
            )
          )}
        </StyledMobileCarousel>
        <StyledDescriptionBody>
          {getImageDescription(recommendation)}
        </StyledDescriptionBody>
      </StyledMobileCarouselCard>
    );
  }

  return (
    <StyledCarouselCard
      title={_.get(recommendation, recommendationValuesConstants.NAME)}
      bordered={false}
    >
      <StyledCarousel autoplay effect="fade">
        {_.get(recommendation, recommendationValuesConstants.IMAGES, []).map(
          (imageSrc) => (
            <StyledFigure key={imageSrc}>
              <StyledImage src={imageSrc} />
              <StyledCarouselDescriptionBody>
                {getImageDescription(recommendation)}
              </StyledCarouselDescriptionBody>
            </StyledFigure>
          )
        )}
      </StyledCarousel>
    </StyledCarouselCard>
  );
};
