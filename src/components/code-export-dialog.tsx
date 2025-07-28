import { useState, useEffect } from "react";
import { Copy, Check, Code, X } from "lucide-react";

interface CodeExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectsCode: string;
  testimonialsCode: string;
}

export const CodeExportDialog = ({
  isOpen,
  onClose,
  projectsCode,
  testimonialsCode,
}: CodeExportDialogProps) => {
  const [activeTab, setActiveTab] = useState<"projects" | "testimonials">(
    "projects"
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const codeToCopy =
      activeTab === "projects" ? projectsCode : testimonialsCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code size={20} className="text-primary" />
            TypeScript Data File
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            className={`px-4 py-2 ${
              activeTab === "projects"
                ? "bg-primary/20 text-primary border-b-2 border-primary"
                : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            projectdata.ts
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "testimonials"
                ? "bg-primary/20 text-primary border-b-2 border-primary"
                : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("testimonials")}
          >
            testimonialdata.ts
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">
              You can copy this code and{" "}
              <code className="bg-black/30 px-1 py-0.5 rounded">
                {activeTab === "projects"
                  ? "src/data/projectdata.ts"
                  : "src/data/testimonialdata.ts"}
              </code>{" "}
              Paste it into the file.
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="bg-black/50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            <code>
              {activeTab === "projects" ? projectsCode : testimonialsCode}
            </code>
          </pre>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>Note:</strong> This approach stores the data directly in
              TypeScript files. To make changes permanent, you need to manually
              add this code to the relevant files. When the application
              restarts, the data from these files will be used.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
