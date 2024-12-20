import { FileText } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useState } from "react";

const FileUpload = ({ handleFileChange, fileInputRef, setFileName }) => {
  const validateFileType = (event) => {
    const selectedFile = event.target.files[0];
    const allowedExtensions = [".csv", ".xlsx"];

    const fileExtension = selectedFile.name.split(".").pop();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      toast.error("Please upload a valid file (.csv or .xlsx).");
      event.target.value = "";
      return;
    }
    setFileName(selectedFile.name);
    handleFileChange(event);
  };

  return (
    <div className="relative p-2 pl-4">
      <input
        type="file"
        onChange={validateFileType}
        ref={fileInputRef}
        accept=".csv,.xlsx"
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex items-center px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
      >
        <FileText className="w-5 h-8" />
      </label>
    </div>
  );
};

FileUpload.propTypes = {
  handleFileChange: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  setFileName: PropTypes.func.isRequired,
};

export default FileUpload;
