import { ResumeUpload } from "@/components/resume-upload/resume-upload";

export default function ResumeUploadPage() {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-3xl">
                <h1 className="mb-10 text-3xl font-bold">
                    Upload Resume
                </h1>

                <ResumeUpload />
            </div>
        </div>

    );
}