import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaUpload,
  FaEye,
  FaLock,
  FaDownload,
  FaStar,
  FaTrash,
  FaFilePdf,
  FaFileWord,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaShieldAlt,
  FaGlobe,
  FaSpinner,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useSeekerStore from "../../store/seekerStore";

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "—";
  if (d === "System") return "System Generated";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

const formatSize = (bytes) => {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExt = (fileName = "") => fileName.split(".").pop().toLowerCase();

// ─── File icon ────────────────────────────────────────────────────────────────
const FileIcon = ({ fileName = "", size = "text-2xl", system = false }) => {
  const ext = getExt(fileName);
  const isPdf = ext === "pdf";
  const cls = system
    ? "text-sky-500"
    : isPdf
      ? "text-rose-500"
      : "text-blue-500";
  return isPdf ? (
    <FaFilePdf className={`${cls} ${size}`} />
  ) : (
    <FaFileWord className={`${cls} ${size}`} />
  );
};

// ─── Pill badge ───────────────────────────────────────────────────────────────
const Badge = ({ children, color = "emerald" }) => {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    gray: "bg-gray-100   text-gray-600   border-gray-200",
    sky: "bg-sky-50     text-sky-700    border-sky-100",
    amber: "bg-amber-50   text-amber-700  border-amber-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${map[color]}`}
    >
      {children}
    </span>
  );
};

// ─── Action button ────────────────────────────────────────────────────────────
const ActionBtn = ({ onClick, title, disabled, children, danger }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed
      ${
        danger
          ? "text-red-400 hover:text-red-600 hover:bg-red-50"
          : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
      }`}
  >
    {children}
  </button>
);

// ─── Animated progress bar ────────────────────────────────────────────────────
const ProgressBar = ({ value }) => (
  <div className="mt-4">
    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
      <span className="font-medium">Uploading…</span>
      <span className="font-bold text-emerald-600">{value}%</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          background: "linear-gradient(90deg,#10b981,#059669)",
        }}
      />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const SeekerCVUpload = () => {
  const {
    fetchSeekerProfile,
    uploadResumeFile,
    updateResumeAssetVisibility,
    setResumeAssetActive,
    deleteResumeAsset,
  } = useSeekerStore();

  // ── state ──────────────────────────────────────────────────────────────────
  const [cvs, setCvs] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [busy, setBusy] = useState({});

  const fileRef = useRef(null);

  // ── load CVs from profile ──────────────────────────────────────────────────
  const loadCVs = useCallback(async () => {
    const result = await fetchSeekerProfile();
    if (result?.success && result?.data) {
      // Check if resumeAssets array exists and has items
      let assets = [];

      if (
        result.data.resumeAssets &&
        Array.isArray(result.data.resumeAssets) &&
        result.data.resumeAssets.length > 0
      ) {
        // Use resumeAssets if available
        assets = result.data.resumeAssets;
      } else if (result.data.resumeFileUrl) {
        // Convert single resumeFileUrl to CV object format
        const fileName =
          result.data.resumeFileUrl.split("/").pop() || "resume.pdf";
        const fileExt = getExt(fileName);

        assets = [
          {
            _id: result.data.activeResumeFileId || "single-resume",
            title: "My Resume",
            fileName: fileName,
            resumeFileUrl: result.data.resumeFileUrl,
            fileUrl: result.data.resumeFileUrl,
            url: result.data.resumeFileUrl,
            isActive: true,
            visibility: "public",
            type: "uploaded",
            uploadDate: result.data.updatedAt || result.data.createdAt,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt,
            fileSize: null, // Size not provided in your API response
            fileExt: fileExt,
          },
        ];
      }

      setCvs(assets);
    }
    setPageLoading(false);
  }, [fetchSeekerProfile]);

  useEffect(() => {
    loadCVs();
  }, [loadCVs]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const setBusyId = (id, v) => setBusy((p) => ({ ...p, [id]: v }));
  const resetModal = () => {
    setShowModal(false);
    setCvTitle("");
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── file select ────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    const ext = getExt(file.name);
    if (!["pdf", "doc", "docx"].includes(ext)) {
      toast.error("Only PDF and Word files allowed");
      return;
    }

    setSelectedFile(file);
    if (!cvTitle) setCvTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect({ target: { files: [file] } });
  };

  // ── UPLOAD ─────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile || !cvTitle.trim()) {
      toast.error("Please select a file and enter a title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const fd = new FormData();
    fd.append("resumeFile", selectedFile);
    fd.append("title", cvTitle.trim());

    const tick = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + 5 : p));
    }, 200);

    try {
      const result = await uploadResumeFile(fd);
      clearInterval(tick);

      if (result?.success) {
        setUploadProgress(100);
        toast.success("CV uploaded successfully!");
        setTimeout(async () => {
          await loadCVs();
          resetModal();
          setIsUploading(false);
        }, 600);
      } else {
        toast.error(result?.error || "Upload failed. Please try again.");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch {
      clearInterval(tick);
      toast.error("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ── TOGGLE VISIBILITY (public / private) ───────────────────────────────────
  const handleToggleVisibility = async (cv) => {
    if (cv.type === "system" || cv._id === "single-resume") {
      toast.info("Visibility toggle not available for this CV");
      return;
    }

    const newVis = cv.visibility === "private" ? "public" : "private";
    setBusyId(cv._id, true);
    const result = await updateResumeAssetVisibility(cv._id, newVis);
    if (result?.success) {
      setCvs((p) =>
        p.map((c) => (c._id === cv._id ? { ...c, visibility: newVis } : c)),
      );
    } else {
      toast.error("Failed to update visibility");
    }
    setBusyId(cv._id, false);
  };

  // ── SET ACTIVE (default) ───────────────────────────────────────────────────
  const handleSetActive = async (cv) => {
    if (cv.isActive) return;

    if (cv._id === "single-resume") {
      toast.info("This is your active resume");
      return;
    }

    setBusyId(cv._id, true);
    const result = await setResumeAssetActive(cv._id, true);
    if (result?.success) {
      setCvs((p) => p.map((c) => ({ ...c, isActive: c._id === cv._id })));
    } else {
      toast.error("Failed to set as default");
    }
    setBusyId(cv._id, false);
  };

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const handleDelete = async (cv) => {
    if (cv.type === "system") {
      toast.info("System CV cannot be deleted");
      return;
    }

    if (cv._id === "single-resume") {
      toast.info("Cannot delete the main resume file");
      return;
    }

    if (!window.confirm(`Delete "${cv.title || cv.fileName}"?`)) return;
    setBusyId(cv._id, true);
    const result = await deleteResumeAsset(cv._id);
    if (result?.success) {
      setCvs((p) => p.filter((c) => c._id !== cv._id));
      toast.success("CV deleted");
    } else {
      toast.error("Failed to delete");
    }
    setBusyId(cv._id, false);
  };

  // ── PREVIEW / DOWNLOAD ─────────────────────────────────────────────────────
  const handlePreview = (cv) => {
    const url = cv.resumeFileUrl || cv.fileUrl || cv.url;
    if (url) window.open(url, "_blank", "noopener noreferrer");
    else toast.info("Preview not available");
  };

  const handleDownload = (cv) => {
    const url = cv.resumeFileUrl || cv.fileUrl || cv.url;
    if (!url) {
      toast.info("Download not available");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = cv.fileName || cv.title || "resume";
    a.click();
  };

  // ── loading skeleton ───────────────────────────────────────────────────────
  if (pageLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-200 animate-pulse">
            <FaFileAlt className="text-white text-xl" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading your CVs…</p>
        </div>
      </div>
    );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <Link
            to="/"
            className="hover:text-emerald-600 transition-colors font-medium"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-emerald-600 font-semibold">CV Manager</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Manage Your CVs
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:w-2/3 space-y-4">
            {/* Header card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Your CVs
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cvs.length} document{cvs.length !== 1 ? "s" : ""} on file
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-emerald-200"
                >
                  <FaPlus size={11} /> Upload CV
                </button>
              </div>
            </div>

            {/* CV list */}
            {cvs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-300 text-2xl" />
                </div>
                <p className="text-gray-500 font-semibold text-sm">
                  No CVs uploaded yet
                </p>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                  Upload your first CV to get started
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-all"
                >
                  <FaUpload size={11} /> Upload Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cvs.map((cv) => {
                  const isSystem = cv.type === "system";
                  const isPrivate = cv.visibility === "private";
                  const isBusy = !!busy[cv._id];
                  const hasUrl = !!(cv.resumeFileUrl || cv.fileUrl || cv.url);
                  const isMainResume = cv._id === "single-resume";

                  return (
                    <div
                      key={cv._id}
                      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md overflow-hidden
                        ${cv.isActive ? "border-emerald-300 shadow-sm shadow-emerald-100" : "border-gray-100"}`}
                    >
                      {/* Active indicator strip */}
                      {cv.isActive && (
                        <div
                          className="h-0.5 w-full"
                          style={{
                            background:
                              "linear-gradient(90deg,#10b981,#059669)",
                          }}
                        />
                      )}

                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* File icon */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isSystem ? "bg-sky-50" : "bg-gray-50"}`}
                          >
                            <FileIcon
                              fileName={cv.fileName}
                              system={isSystem}
                              size="text-xl"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <h3 className="font-bold text-gray-800 text-sm truncate max-w-xs">
                                {cv.title || cv.fileName || "Untitled CV"}
                              </h3>
                              {cv.isActive && (
                                <Badge color="emerald">
                                  <FaStar size={8} /> Active
                                </Badge>
                              )}
                              {isPrivate && (
                                <Badge color="gray">
                                  <FaLock size={8} /> Private
                                </Badge>
                              )}
                              {isSystem && <Badge color="sky">System</Badge>}
                              {isMainResume && (
                                <Badge color="amber">Primary</Badge>
                              )}
                            </div>

                            {/* <p className="text-xs text-gray-400 truncate">
                              <FaFileAlt className="inline mr-1" size={10} />
                              {cv.fileName || "resume.pdf"}
                              {cv.fileSize ? (
                                <span className="ml-2 text-gray-300">
                                  · {formatSize(cv.fileSize)}
                                </span>
                              ) : null}
                            </p> */}

                            <p className="text-[10px] text-gray-400 mt-1">
                              {cv.uploadDate || cv.createdAt
                                ? `Uploaded: ${formatDate(cv.uploadDate || cv.createdAt)}`
                                : "Always available"}
                            </p>

                            {/* URL preview */}
                            {/* {hasUrl && (
                              <p className="text-[10px] text-emerald-500 mt-0.5 truncate font-medium">
                                {cv.resumeFileUrl || cv.fileUrl || cv.url}
                              </p>
                            )} */}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {isBusy ? (
                              <div className="w-8 h-8 flex items-center justify-center">
                                <FaSpinner className="animate-spin text-emerald-500 text-sm" />
                              </div>
                            ) : (
                              <>
                                <ActionBtn
                                  onClick={() => handlePreview(cv)}
                                  title="Preview"
                                >
                                  <FaEye size={13} />
                                </ActionBtn>
                                <ActionBtn
                                  onClick={() => handleDownload(cv)}
                                  title="Download"
                                >
                                  <FaDownload size={13} />
                                </ActionBtn>
                                {!isSystem && !isMainResume && (
                                  <ActionBtn
                                    onClick={() => handleToggleVisibility(cv)}
                                    title={
                                      isPrivate ? "Make Public" : "Make Private"
                                    }
                                  >
                                    {isPrivate ? (
                                      <FaLock size={12} />
                                    ) : (
                                      <FaGlobe size={12} />
                                    )}
                                  </ActionBtn>
                                )}
                                {!isSystem && !cv.isActive && !isMainResume && (
                                  <ActionBtn
                                    onClick={() => handleSetActive(cv)}
                                    title="Set as Active"
                                  >
                                    <FaStar size={12} />
                                  </ActionBtn>
                                )}
                                {!isSystem && !isMainResume && (
                                  <ActionBtn
                                    onClick={() => handleDelete(cv)}
                                    title="Delete"
                                    danger
                                  >
                                    <FaTrash size={12} />
                                  </ActionBtn>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Set active CTA */}
                        {!isSystem &&
                          !cv.isActive &&
                          !isBusy &&
                          !isMainResume && (
                            <div className="mt-3 pt-3 border-t border-gray-50">
                              <button
                                onClick={() => handleSetActive(cv)}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                              >
                                <FaStar size={10} /> Set as Active
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 space-y-4">
              <h2 className="font-extrabold text-gray-800 text-base tracking-tight">
                CV Manager Guide
              </h2>

              {[
                {
                  color: "emerald",
                  dot: "bg-emerald-500",
                  icon: <FaStar className="text-emerald-500" />,
                  title: "Active CV",
                  desc: "Employers see this when they search. Set any CV as active — it updates instantly.",
                },
                {
                  color: "violet",
                  dot: "bg-violet-500",
                  icon: <FaLock className="text-violet-500" />,
                  title: "Private CV",
                  desc: "Only visible to you. Toggle privacy any time using the lock icon.",
                },
                {
                  color: "sky",
                  dot: "bg-sky-500",
                  icon: <FaFileAlt className="text-sky-500" />,
                  title: "Multiple CVs",
                  desc: "Upload different CVs tailored for different roles or industries.",
                },
                {
                  color: "amber",
                  dot: "bg-amber-500",
                  icon: <FaStar className="text-amber-500" />,
                  title: "Primary Resume",
                  desc: "Your main resume file from profile setup.",
                },
              ].map(({ dot, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}
                    />
                    <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pl-4">
                    {desc}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Quick Tips
                </p>
                <ul className="space-y-2">
                  {[
                    "Keep your active CV updated regularly",
                    "Use tailored CVs for specific job types",
                    "Download backups of your CVs periodically",
                    "PDF format is recommended for best compatibility",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-xs text-gray-600"
                    >
                      <FaCheck className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload CTA */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-emerald-200"
              >
                <FaPlus size={11} /> Upload New CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal - same as before */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          style={{ animation: "fadeIn 0.18s ease" }}
        >
          <style>{`
            @keyframes fadeIn   { from{opacity:0}         to{opacity:1} }
            @keyframes slideUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          `}</style>

          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ animation: "slideUp 0.22s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                  Upload Your CV
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  PDF, DOC or DOCX · Max 10 MB
                </p>
              </div>
              <button
                onClick={resetModal}
                disabled={isUploading}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-40"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Requirements
                </p>
                {[
                  "File size under 10 MB",
                  "PDF, DOC or DOCX format only",
                  "Not password protected",
                  "No macros or viruses",
                ].map((r) => (
                  <div
                    key={r}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <FaCheck className="text-emerald-500 shrink-0" size={10} />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  CV Title *
                </label>
                <input
                  type="text"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. My Professional CV"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  File *
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => !isUploading && fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-200
                    ${isUploading ? "opacity-50 pointer-events-none" : "hover:border-emerald-400 hover:bg-emerald-50/30"}
                    ${selectedFile ? "border-emerald-300 bg-emerald-50/20" : "border-gray-200"}`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                        <FileIcon
                          fileName={selectedFile.name}
                          size="text-2xl"
                        />
                      </div>
                      <p className="text-sm font-bold text-gray-700 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatSize(selectedFile.size)}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        disabled={isUploading}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FaUpload className="text-gray-400 text-lg" />
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="text-emerald-600 font-bold">
                          Click to upload
                        </span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOC, DOCX · Max 10 MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isUploading && <ProgressBar value={uploadProgress} />}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={resetModal}
                  disabled={isUploading}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !cvTitle.trim()}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="animate-spin" size={13} />{" "}
                      Uploading…
                    </>
                  ) : (
                    <>
                      <FaUpload size={12} /> Save CV
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
