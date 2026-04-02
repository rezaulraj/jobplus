import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ value, onChange, placeholder, height = 200 }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Quill once
    if (!quillInstance.current && editorRef.current && !isInitialized) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Start typing...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
          ],
        },
        formats: [
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "bullet",
          "align",
          "link",
          "image",
        ],
      });

      // Set initial content
      if (value) {
        quillInstance.current.root.innerHTML = value;
      }

      // Handle text change
      quillInstance.current.on("text-change", () => {
        if (quillInstance.current) {
          const html = quillInstance.current.root.innerHTML;
          onChange(html);
        }
      });

      setIsInitialized(true);
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
        quillInstance.current = null;
        setIsInitialized(false);
      }
    };
  }, [onChange, placeholder, value]);

  // Update content when value prop changes from parent
  useEffect(() => {
    if (
      quillInstance.current &&
      value !== undefined &&
      value !== quillInstance.current.root.innerHTML
    ) {
      quillInstance.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div
      style={{ height: `${height}px` }}
      className="border border-gray-300 rounded-xl overflow-hidden"
    >
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
