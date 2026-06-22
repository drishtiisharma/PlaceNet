import { useState, useEffect } from "react"
import DropZone from "../components/DropZone"
import ResumeList from "../components/ResumeList"
import Header from "../components/Header"
import { uploadResume, listResumes, deleteResume } from "../api/resumes"

export default function Resumes() {
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchResumes()
    }, [])

    async function fetchResumes() {
        try {
            const data = await listResumes()
            setFiles(data)
        } catch (err) {
            console.error("Failed to fetch resumes", err)
        }
    }

    async function handleFilesAdded(newFiles) {
        setUploading(true)
        for (const file of newFiles) {
            try {
                await uploadResume(file)
            } catch (err) {
                console.error("Upload failed for", file.name, err)
            }
        }
        await fetchResumes()
        setUploading(false)
    }

    async function handleDelete(filename) {
        try {
            await deleteResume(filename)
            setFiles(prev => prev.filter(f => f.filename !== filename))
        } catch (err) {
            console.error("Delete failed", err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header fileCount={files.length} onFilesAdded={handleFilesAdded} />

            <div className="max-w-3xl mx-auto px-8 py-8">
                {uploading && (
                    <div className="mb-4 text-sm text-blue-600 font-medium animate-pulse">
                        Uploading...
                    </div>
                )}
                <DropZone onFilesAdded={handleFilesAdded} />
                <ResumeList files={files} onDelete={handleDelete} />
            </div>
        </div>
    )
}