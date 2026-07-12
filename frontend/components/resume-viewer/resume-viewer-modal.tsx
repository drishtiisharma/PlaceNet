"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useResumeViewer } from "./resume-viewer-context";

// Setting up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function ResumeViewerModal() {
    const { isOpen, closeResume, resumeId } = useResumeViewer();
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    if (!isOpen || !resumeId) return null;

    const fileUrl = `http://127.0.0.1:8000/resume/view/${resumeId}`;

    return (
        <Dialog open={isOpen} onOpenChange={(open: any) => !open && closeResume()}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b flex-row justify-between items-center">
                    <DialogTitle>Resume Viewer</DialogTitle>
                    <div className="flex items-center gap-2 pr-8">
                        <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                        <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        <Button variant="outline" size="icon" disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            {pageNumber} / {numPages || "-"}
                        </span>
                        <Button variant="outline" size="icon" disabled={pageNumber >= (numPages || 1)} onClick={() => setPageNumber(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        <Button variant="default" size="sm" onClick={() => window.open(`http://127.0.0.1:8000/resume/download/${resumeId}`)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-muted/30 p-6 flex justify-center">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="flex items-center justify-center h-full">Loading PDF...</div>}
                        error={<div className="text-red-500">Failed to load PDF file.</div>}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="shadow-lg bg-white"
                        />
                    </Document>
                </div>
            </DialogContent>
        </Dialog>
    );
}
