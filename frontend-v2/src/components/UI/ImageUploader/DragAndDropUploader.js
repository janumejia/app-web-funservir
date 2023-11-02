import React from 'react';
import { IoIosCloudUpload } from 'react-icons/io';
import { Upload, message } from 'antd';
import styled from 'styled-components';
const DraggerWrapper = styled.div``;

const { Dragger } = Upload;

const DragAndDropUploader = ({onUploadChange, maxImgs}) => {
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
      onUploadChange(result);
      message.success(`¡${info.file.name} ha sido subida correctamente!.`);
      status = null;
    } else if(info.file.status === 'removed'){
      if(info.file.url){
        onUploadChange(info.fileList, info.file);
      }else{
        onUploadChange(info.fileList);
      }
      
      message.error(`${info.file.name} ha sido eliminada.`);
    }
  }
    // const listResult = value?.map((element)=>{
    //   return {
    //     uid: element.uid,
    //     name: element.name,
    //     thumbUrl: element.thumbUrl,
    //     lastModified: element.lastModified,
    //     lastModifiedDate: element.lastModifiedDate,
    //     originFileObj: element.originFileObj,
    //     percent: element.percent,
    //     size: element.size,
    //     status: element.status,
    //     type: element.type
    //   }
    // })
  
  return (
    <DraggerWrapper className="drag_and_drop_uploader">
      <Dragger
      name = "file"
      listType='picture-card'
      className="upload-list-inline"
      beforeUpload={beforeUpload} 
      multiple= {true}
      maxCount={maxImgs ? maxImgs : 8}
      onChange={handleOnChange}
      //defaultFileList={listResult}
      >
        <div className="ant-upload-drag-icon">
          <IoIosCloudUpload />
        </div>
        <p className="ant-upload-text">
          Arrastra y suelta tus fotos para subirlas o haz clic y selecciona.
        </p>
      </Dragger>
    </DraggerWrapper>
  );
};

export default DragAndDropUploader;
