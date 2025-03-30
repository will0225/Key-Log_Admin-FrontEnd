import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const CSVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  // Handle form submission (send file to the backend)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem('token');
    try {
      // Send file to backend
      const response = await axios.post(`${API_URL}/csv-upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          "Authorization": token
        },
      });

      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div>
      {/* <h2>Upload CSV File</h2> */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default CSVUpload;