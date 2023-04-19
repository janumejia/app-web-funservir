import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";


const UploadComponent = (({ loading, handleChange, imageUrl }) => {
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
                if (!isJpgOrPng) {
                    message.error('¡Solo puedes subir imagenes!');
                    return Upload.LIST_IGNORE;
                }else{
                    return false;
                }
            }}
            onChange={handleChange}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: '50%',
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