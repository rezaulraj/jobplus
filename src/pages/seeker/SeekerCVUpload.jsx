import React, { useState, useRef } from "react";
import {
  FaUpload,
  FaEye,
  FaEdit,
  FaLock,
  FaUnlock,
  FaDownload,
  FaStar,
  FaTrash,
  FaFilePdf,
  FaFileWord,
  FaCheck,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SeekerCVUpload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cvs, setCvs] = useState([
    {
      id: 1,
      title: "My Professional CV",
      fileName: "professional_cv.pdf",
      uploadDate: "2024-01-15",
      isDefault: true,
      isPrivate: false,
      fileType: "pdf",
    },
    {
      id: 2,
      title: "Technical CV",
      fileName: "technical_skills.docx",
      uploadDate: "2024-01-10",
      isDefault: false,
      isPrivate: true,
      fileType: "docx",
    },
    {
      id: 0,
      title: "Profile CV",
      fileName: "profile_generated.pdf",
      uploadDate: "System",
      isDefault: false,
      isPrivate: false,
      fileType: "pdf",
    },
  ]);

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isAllowedType =
        allowedTypes.includes(file.type) ||
        ["pdf", "doc", "docx"].includes(fileExtension);

      if (!isAllowedType) {
        alert("Only PDF and Word documents are allowed");
        return;
      }

      setSelectedFile(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      setCvTitle(title);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !cvTitle.trim()) {
      alert("Please select a file and enter a CV title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const fileExtension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();
          const fileType =
            fileExtension === "pdf"
              ? "pdf"
              : fileExtension === "docx"
                ? "docx"
                : "doc";

          const newCV = {
            id: cvs.length + 1,
            title: cvTitle,
            fileName: selectedFile.name,
            uploadDate: new Date().toISOString().split("T")[0],
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            isDefault: false,
            isPrivate: false,
            fileType: fileType,
          };

          setCvs((prev) => [...prev, newCV]);
          setIsUploading(false);
          setShowUploadModal(false);
          setCvTitle("");
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const togglePrivacy = (id) => {
    setCvs(
      cvs.map((cv) =>
        cv.id === id ? { ...cv, isPrivate: !cv.isPrivate } : cv,
      ),
    );
  };

  const setAsDefault = (id) => {
    setCvs(
      cvs.map((cv) => ({
        ...cv,
        isDefault: cv.id === id,
      })),
    );
  };

  const handleDownload = (cv) => {
    alert(`Downloading ${cv.fileName}`);
  };

  const handleDelete = (id) => {
    if (id === 0) {
      alert("Profile CV cannot be deleted");
      return;
    }
    setCvs(cvs.filter((cv) => cv.id !== id));
  };

  const handleEdit = (cv) => {
    alert(
      `Editing ${cv.title} - This would open edit form in a real application`,
    );
  };

  const handlePreview = (cv) => {
    alert(`Previewing ${cv.title} - This would open preview in a new window`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-green-600 cursor-pointer">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-green-600 font-medium">CV Manager</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Your CVs
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your CVs
                </h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-secondary hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <FaUpload className="text-white" />
                  Upload CV
                </button>
              </div>

              {/* CV */}
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                        <div
                          className={`p-3 rounded-lg ${cv.id === 0 ? "bg-blue-100" : "bg-green-100"}`}
                        >
                          {cv.fileType === "pdf" ? (
                            <FaFilePdf
                              className={`text-lg ${cv.id === 0 ? "text-blue-600" : "text-green-600"}`}
                            />
                          ) : (
                            <FaFileWord
                              className={`text-lg ${cv.id === 0 ? "text-blue-600" : "text-green-600"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-800 text-base">
                              {cv.title}
                            </h3>
                            {cv.isDefault && (
                              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                <FaStar className="text-xs" /> Default
                              </span>
                            )}
                            {cv.isPrivate && (
                              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                <FaLock className="text-xs" /> Private
                              </span>
                            )}
                            {cv.id === 0 && (
                              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                                System Generated
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <FaFileAlt
                              className="inline mr-1 text-gray-400"
                              size={12}
                            />
                            {cv.fileName}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span>Uploaded: {cv.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:justify-start gap-2">
                        {/* Preview */}
                        <button
                          onClick={() => handlePreview(cv)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Preview"
                        >
                          <FaEye />
                        </button>

                        {/* Edit */}
                        {cv.id !== 0 && (
                          <button
                            onClick={() => handleEdit(cv)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}

                        {/* Privacy */}
                        {cv.id !== 0 && (
                          <button
                            onClick={() => togglePrivacy(cv.id)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title={
                              cv.isPrivate ? "Make Public" : "Make Private"
                            }
                          >
                            {cv.isPrivate ? <FaLock /> : <FaUnlock />}
                          </button>
                        )}

                        <button
                          onClick={() => handleDownload(cv)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Download"
                        >
                          <FaDownload />
                        </button>

                        {cv.id !== 0 && !cv.isDefault && (
                          <button
                            onClick={() => setAsDefault(cv.id)}
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                            title="Make Default"
                          >
                            <FaStar />
                          </button>
                        )}

                        {/* Delete */}
                        {cv.id !== 0 && (
                          <button
                            onClick={() => handleDelete(cv.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                    {cv.id !== 0 && !cv.isDefault && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setAsDefault(cv.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                        >
                          <FaStar />
                          Make Default
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                A Quick Guide To Managing Your CVs
              </h2>

              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shrink-0"></div>
                    <h3 className="font-medium text-gray-800">Default CV</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    This is the CV that employers will see every time they
                    search for a CV. If you have multiple CVs, you can make a
                    specific CV "Default" by clicking "Make Default".
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0"></div>
                    <h3 className="font-medium text-gray-800">Private CV</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    This CV is visible only to you. You can make a CV private
                    (and vice versa) by clicking the lock icon.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                    <h3 className="font-medium text-gray-800">Multiple CVs</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    You can have more than one CV uploaded against your profile.
                    These additional CVs can be tailored to work best against
                    specific job types.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500 shrink-0"></div>
                    <h3 className="font-medium text-gray-800">Profile CV</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    This is a system generated CV and can not be deleted. It is
                    the default CV used to apply for jobs when you have not
                    added any of your own.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">Quick Tips:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Keep your default CV updated regularly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Use private CVs for job-specific applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Download and backup your CVs periodically</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 drop-shadow-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Upload Your CV
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setCvTitle("");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">
                  Upload Requirements:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Not be larger than 3 MB in size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Not be other than Word Document or PDF file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Not be password protected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Not contain any macros or viruses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-0.5 shrink-0" />
                    <span>Give printing rights to everyone</span>
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV Title *
                </label>
                <input
                  type="text"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter CV title"
                  disabled={isUploading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200 cursor-pointer"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <div>
                    <FaUpload className="mx-auto text-gray-400 mb-3 text-2xl" />
                    <p className="text-gray-600 mb-1">
                      <span className="text-green-600 font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Maximum size of 10.0MB for a file.
                    </p>
                    <p className="text-xs text-gray-500">
                      Allowed Types: pdf, docx, doc
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isUploading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setCvTitle("");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !cvTitle.trim()}
                  className="flex-1 py-3 px-4 bg-[#4eb956] text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Save CV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerCVUpload;
