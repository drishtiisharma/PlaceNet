import { Upload } from "lucide-react"
import { useRef } from "react"

export default function Header({ fileCount, onFilesAdded }) {
    const inputRef = useRef(null)

    function handleChange(e) {
        const selected = Array.from(e.target.files).filter(
            f => f.type === "application/pdf"
        )
        if (selected.length) onFilesAdded(selected)
        e.target.value = ""
    }

    return (
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Resume Management</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {fileCount > 0 ? `${fileCount} resume${fileCount > 1 ? "s" : ""} queued` : "No resumes yet"}
                </p>
            </div>

            <button
                onClick={() => inputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
                <Upload size={16} />
                Upload Resumes
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                />
            </button>
        </div>
    )
}