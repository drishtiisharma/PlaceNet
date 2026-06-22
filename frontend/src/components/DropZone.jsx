import { useState } from "react"
import { UploadCloud } from "lucide-react"

export default function DropZone({ onFilesAdded }) {
    const [dragging, setDragging] = useState(false)

    function handleDrop(e) {
        e.preventDefault()
        setDragging(false)
        const dropped = Array.from(e.dataTransfer.files).filter(
            f => f.type === "application/pdf"
        )
        if (dropped.length) onFilesAdded(dropped)
    }

    function handleChange(e) {
        const selected = Array.from(e.target.files).filter(
            f => f.type === "application/pdf"
        )
        if (selected.length) onFilesAdded(selected)
    }

    return (
        <label
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-colors
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}`}
        >
            <UploadCloud size={36} className={dragging ? "text-blue-500" : "text-gray-400"} />
            <p className="text-sm font-medium text-gray-600">
                Drag & drop PDFs here
            </p>
            <p className="text-xs text-gray-400">or click to browse</p>
            <input
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleChange}
            />
        </label>
    )
}