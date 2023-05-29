import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { Upload, Modal, message } from 'antd';
import { ImageUpload } from './imageUploader.style';
import DragAndDropUploader from 'components/UI/ImageUploader/DragAndDropUploader';
export default class ImageUploader extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    console.log("file: ", file.originFileObj)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // handleChange = ( file ) => {
  //   console.log("fileList: ", file)
  //   this.props.setImage(file.fileList);
  //   this.setState({ fileList: file.fileList });
  // }

  render() {
    const { previewVisible, previewImage } = this.state;
    const Dragger = Upload.Dragger;

    let status = null;
    const beforeUpload = (file) => {

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJpgOrPng) {
        message.error('¡Solo puedes subir archivos de tipo imagen (JPG/PNG)!');
        file.status = 'error'
      }else if (!isLt2M) {
        message.error('¡La imagen debe pesar menos de 2MB!');
        file.status = 'error'
      }else{
        file.status = 'done'
        status = 'done'
      }
      return false;
    };

    const removeBadPics = (picture) =>{
      return picture.status !== 'error';
    }
    const handleOnChange = (info) => {
      
      if (status === 'done') {
        const result = info.fileList.filter(removeBadPics);
        this.props.setImage(result);
        message.success(`¡${info.file.name} ha sido subida correctamente!`);
        status = null;
      } else if(info.file.status === 'removed'){
        this.props.setImage(info.fileList);
        message.success(`${info.file.name} ha sido eliminada`);
      }
    }
  
    const uploadButton = (
      <ImageUpload>
        <div className="image-drag-area">
          <FaCamera />
        </div>
        {this.props.fileList && this.props.fileList.length >= 1
          ? (<div className="ant-upload-text">Cambiar Imagen</div>)
          : (<div className="ant-upload-text">Subir Imagen</div>)
        }
      </ImageUpload>
    );

    return (
      <div className="clearfix">
        <Dragger
          name = "file"
          beforeUpload={beforeUpload}
          listType="picture-card"
          fileList={this.props.fileList}
          onPreview={this.handlePreview}
          onChange={handleOnChange}
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
          <img alt="imagen" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
