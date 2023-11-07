import { UploadOutlined } from "@ant-design/icons";
import { UploadProps, Upload, Button } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";


type props = {
    onUpload?: () => void | null | undefined
}

export const UploadFileButton = (props: props) => {
    
    const onUpload = (file: UploadChangeParam<UploadFile<any>>) => {
        if (file.file.status === 'done') {
            console.log("UPLOADED")
            if (props.onUpload) {
                props.onUpload()
            }
            
        }
        
    }
   
      return (
        <Upload
          className="component-upload-files"
          action="http://localhost:5000/api/upload"
          onChange={(file) => onUpload(file)}
          >
            <Button type="text" block><UploadOutlined />Upload Files</Button>
          </Upload>
      );
}