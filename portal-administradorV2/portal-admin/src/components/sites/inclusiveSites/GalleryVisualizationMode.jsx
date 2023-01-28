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

const GalleryVisualizationMode = ({ urlArray, myKey }) => {
  
    return (
        <Upload
            {...props}
        >
        </Upload >

    )
}

export default GalleryVisualizationMode;
