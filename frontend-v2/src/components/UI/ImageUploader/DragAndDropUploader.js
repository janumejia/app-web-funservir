import React from 'react';
import { IoIosCloudUpload } from 'react-icons/io';
import { Upload, message } from 'antd';
import styled from 'styled-components';

const DraggerWrapper = styled.div``;

const { Dragger } = Upload;


const DragAndDropUploader = ({ name = 'file', onUploadChange }) => {
  const props = {
    name,
    accept:"image/png, image/jpg, image/jpeg",
    showUploadList:true,
    beforeUpload:(file) => false,
    onChange(info) {
        onUploadChange(info.fileList);
    },
  };

  return (
    <DraggerWrapper className="drag_and_drop_uploader">
      <Dragger {...props} className="uploader">
        <div className="ant-upload-drag-icon">
          <IoIosCloudUpload />
        </div>
        <p className="ant-upload-text">
          Arrastra y suelta tus imagenes o da clic para buscar
        </p>
      </Dragger>
    </DraggerWrapper>
  );
};

export default DragAndDropUploader;
