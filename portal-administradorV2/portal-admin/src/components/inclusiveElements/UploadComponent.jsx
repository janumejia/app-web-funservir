import { Upload } from 'antd';
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
                Subir Icono
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
            beforeUpload={(file) => false}
            onChange={handleChange}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                        height:'100%',
                        width: '100%',
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