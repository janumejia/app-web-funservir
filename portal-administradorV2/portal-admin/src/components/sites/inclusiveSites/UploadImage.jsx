import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadImage = ({ gallery }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // filelist es un arreglo con objetos que tienen esta forma:
    // {
    //     uid: '1',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    
    
    // console.log(map)
    
    const [fileList, setFileList] = useState([]);
    
    useEffect(()=> {
        const mapa = gallery.map((element) => {
            const urlSplitted = element.public_id.split("/");
            const objToReturn = {
                uid: element.asset_id,
                name: urlSplitted[urlSplitted.length - 1],
                status: 'done',
                url: element.secure_url,
            };
            return objToReturn;
        })

        console.log("mapa:  ", mapa);

        setFileList(mapa);
    }, [])


    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
            console.log("el base64: ", file.preview)
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Subir archivo</div>
        </div>
    );

    // Para evitar que la componente Upload suba la imagen inmediatamente a alguna URL. Solución encontrada en: https://stackoverflow.com/a/51519603/19294516
    // const dummyRequest = ({ file, onSuccess }) => {
    //     setTimeout(() => {
    //         onSuccess("ok");
    //     }, 0);
    // };

    return (
        <>
            <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={(file) => false}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UploadImage;