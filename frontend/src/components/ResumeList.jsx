import ResumeCard from "./ResumeCard"

export default function ResumeList({ files, onDelete }) {
    if (!files.length) return null

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Queued ({files.length})
                </h2>
            </div>
            <div className="flex flex-col gap-3">
                {files.map(f => (
                    <ResumeCard key={f.name} file={f} onDelete={onDelete} />
                ))}
            </div>
        </div>
    )
}