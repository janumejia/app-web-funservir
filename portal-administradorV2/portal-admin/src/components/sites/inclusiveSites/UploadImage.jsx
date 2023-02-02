import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';

//Tratamiento de imagenes
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadImage = ({ gallery, setArrayBase64, setPreviousImagesPreserved }) => {
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
    console.log("fileList: ", fileList)
    useEffect(() => {
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
            file.preview = await getBase64(file.originFileObj)
            console.log("el base64: ", file.preview)
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        if(newFileList[newFileList.length - 1].originFileObj){
            const isJpgOrPng = newFileList[newFileList.length - 1].originFileObj.type === 'image/jpeg' || newFileList[newFileList.length - 1].originFileObj.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('¡Solo puedes subir imagenes!');
            } else {
                setFileList(newFileList);
            }
            
            console.log("newFileList: ", newFileList);
        } else{
            setFileList(newFileList);
        }

    }
    
    useEffect(() => {
        const storeTheBase64Value = async (newFileList) => {
            const aux1 = [];
            const aux2 = [];
            for (let index = 0; index < newFileList.length; index++) {
                const file = newFileList[index]
                console.log("file: ", file)
                if (file.originFileObj !== undefined) {
                    try {
                        const theBase64 = await getBase64(file.originFileObj);
                        console.log("here is the theBase64: ", theBase64)
                        aux1.push(theBase64);
                    } catch (error) {
                        console.log("Error en el método getBase64_Multiple", error);
                    }
                } else { 
                    aux2.push(file);
                }
            }
            console.log("aux1 :", aux1)
            setArrayBase64(aux1); // Parece que este valor no se actualiza automáticamente
            console.log("aux2 :", aux2)
            setPreviousImagesPreserved(aux2);
        }
        
        storeTheBase64Value(fileList);
    }, [fileList])
    
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
                // accept="image/png, image/jpg, image/jpeg"
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