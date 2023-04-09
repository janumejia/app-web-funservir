import React from 'react';
import { IoIosCloudUpload } from 'react-icons/io';
import { Upload, message } from 'antd';
import styled from 'styled-components';

const DraggerWrapper = styled.div``;

const { Dragger } = Upload;

<<<<<<< HEAD
// const photos = [
//   {
//     uid: '1',
//     name: 'hotel-1.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '2',
//     name: 'hotel-2.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '3',
//     name: 'hotel-3.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
// ];

const DragAndDropUploader = ({value, onUploadChange}) => {
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
=======

const DragAndDropUploader = ({ name = 'file', onUploadChange }) => {
  const props = {
    name,
    accept:"image/png, image/jpg, image/jpeg",
    showUploadList:true,
    beforeUpload:(file) => false,
    onChange(info) {
      const { status } = info.file;
      console.log(status);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        onUploadChange(info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} photo uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} photo upload failed.`);
      }
    },
>>>>>>> c003818 (cambios obligados)
  };

  const handleOnChange = (info) => {
    
    if (status === 'done') {
      onUploadChange(info.fileList);
      message.success(`¡${info.file.name} ha sido subida correctamente!.`);
      status = null;
    } else if(info.file.status === 'removed'){
      onUploadChange(info.fileList);
      message.error(`${info.file.name} ha sido eliminada.`);
    }
  }

  return (
    <DraggerWrapper className="drag_and_drop_uploader">
      <Dragger
      name = "file"
      className="uploader" 
      beforeUpload={beforeUpload} 
      multiple= {true}
      onChange={handleOnChange}
      defaultFileList={value}
      >
        <div className="ant-upload-drag-icon">
          <IoIosCloudUpload />
        </div>
        <p className="ant-upload-text">
<<<<<<< HEAD
          Arrastra y suelta tus fotos para subirlas o haz clic y selecciona.
=======
          Arrastra y suelta tus imagenes o da clic para buscar
>>>>>>> c003818 (cambios obligados)
        </p>
      </Dragger>
    </DraggerWrapper>
  );
};

export default DragAndDropUploader;
