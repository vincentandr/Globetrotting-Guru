import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, message, Modal, Row, Skeleton, Upload } from 'antd';
import { profileActions, recommendationActions, userActions } from '../actions';
import { RecommendationActionPanel, RecommendationCard } from '../components';
import {
  notificationConstants,
  profileValuesConstants,
  recommendationValuesConstants,
} from '../constants';

const StyledUpload = styled(Upload)`
  && {
    margin-top: 12px;
  }
`;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const MAX_IMAGES_UPLOADED = 10;

class RecommendationImageUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleUpload = (option) => {
    const { fileList } = this.state;
    this.props.getRecommendationByImage(fileList);
    setTimeout(() => option.onSuccess('ok'), 0); //Prevent upload errors
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;

    return (
      <>
        <Row>
          Alternatively, you may also generate a recommendation by uploading
          photos:
        </Row>
        <Row>
          <StyledUpload
            customRequest={this.handleUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            multiple={true}
            accept="image/*"
            onClick={() => this.setState({ fileList: [] })}
          >
            {fileList.length >= MAX_IMAGES_UPLOADED ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </StyledUpload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
      </>
    );
  }
}

function mapState(state) {
  return {};
}

const actionCreators = {
  getRecommendationByImage: recommendationActions.getRecommendationByImage,
};

const connectedRecommendationImageUpload = connect(
  mapState,
  actionCreators
)(RecommendationImageUpload);
export { connectedRecommendationImageUpload as RecommendationImageUpload };
