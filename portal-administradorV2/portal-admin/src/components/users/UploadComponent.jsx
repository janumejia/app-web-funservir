import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";


const UploadComponent = (({ loading, handleChange, imageUrl, whichImg }) => {
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Elegir foto
            </div>
        </div>
    );
    return (
        <Upload
            name="avatar"
            accept="image/png, image/jpg, image/jpeg"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={true}
            maxCount={1}
            multiple={false}
            beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
                const isLessThan2MB = file.size / 1024 / 1024 <= 2;
                if (!isJpgOrPng) {
                    message.error('¡Solo puedes subir imágenes!');
                    return Upload.LIST_IGNORE;
                }else if(!isLessThan2MB){
                    message.error('¡La imagen debe pesar menos de 2MB!');
                    return Upload.LIST_IGNORE;
                }else{
                    return false;
                }
            }}
            onChange={(info) => handleChange(info, whichImg)}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: (whichImg === "Perfil" ) && '50%',
                        objectFit: 'contain'
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    )
})

export default UploadComponent; 