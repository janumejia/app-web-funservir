import { Upload } from 'antd';

const props = {
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    },
    showUploadList: {
        showDownloadIcon: true,
        showRemoveIcon: false,
        downloadIcon: 'Download',
    },
};

const GalleryVisualizationMode = ({ urlArray, myKey}) => {
    
    return (
        <div key={myKey} >
        <Upload
            {...props}
            defaultFileList = {[...urlArray]}
        >
        </Upload>
        </div>
    )
}

export default GalleryVisualizationMode;
