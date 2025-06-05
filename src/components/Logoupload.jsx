import React, { useState } from "react";
import { Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "../Axios";
import { showErrorToast, showSuccessToast } from "../utils/toastutils";

const { Option } = Select;

const Logoupload = ({ logoDetail }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleSelectChange = (value) => {
    setSelectedId(value);
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
  if (!selectedId) {
    message.error("Please select a hospital before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file); // ✅ use correct field name
  
  try {
    const response = await axios.post(
      `/Hospital/UploadLogo/${selectedId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    showSuccessToast("Logo uploaded successfully");
    console.log("Upload response:", response);
    message.success(`${file.name} uploaded successfully.`);
    onSuccess("ok");
  } catch (error) {
        showErrorToast(`${error}`);
    console.error("Upload failed:", error);
    message.error(`${file.name} upload failed.`);
        console.log("Upload response:", response);

    onError(error);
  }
};


  return (
    <>
      <div style={{ width: 300, marginBottom: 20 }}>
        <Select
          placeholder="Select a hospital"
          style={{ width: "100%" }}
          onChange={handleSelectChange}
        >
          {logoDetail.map((item) => (
            <Option key={item.hospitalId} value={item.hospitalId}>
              {item.hospitalName}
            </Option>
          ))}
        </Select>
      </div>

      <Upload
        customRequest={handleCustomUpload}
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
        showUploadList={true}
      >
        <Button icon={<UploadOutlined />}>Upload Logo</Button>
      </Upload>
    </>
  );
};

export default Logoupload;
