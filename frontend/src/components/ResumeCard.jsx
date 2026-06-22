import { FileText, Trash2 } from "lucide-react"

export default function ResumeCard({ file, onDelete }) {
    const sizeKB = file.size ? (file.size / 1024).toFixed(1) : "—"

    return (
        <div className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-500" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.filename}</p>
                <p className="text-xs text-gray-400">{sizeKB} KB · PDF</p>
            </div>

            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                Uploaded
            </span>

            <button
                onClick={() => onDelete(file.filename)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}