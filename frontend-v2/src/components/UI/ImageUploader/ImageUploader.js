import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { Upload, Modal } from 'antd';
import { ImageUpload } from './imageUploader.style';
export default class ImageUploader extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.props.setImage(fileList);
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage } = this.state;
    const Dragger = Upload.Dragger;

    const uploadButton = (
      <ImageUpload>
        <div className="image-drag-area">
          <FaCamera />
        </div>
        {this.props.fileList && this.props.fileList.length >= 1
          ? ( <div className="ant-upload-text">Cambiar Imagen</div> )
          : ( <div className="ant-upload-text">Subir Imagen</div> )
        }
      </ImageUpload>
    );

    return (
      <div className="clearfix">
        <Dragger
          beforeUpload={() => false}
          listType="picture-card"
          fileList={this.props.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          className="image_uploader"
          maxCount={1}
        >
          {uploadButton}
        </Dragger>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
