"use client";

import React, { useState, useEffect, useRef } from "react";

interface TypewriterSegment {
    text: string;
    className?: string;
    isBlock?: boolean;
}

interface TypewriterTextProps {
    segments: TypewriterSegment[];
    speed?: number;
    className?: string;
}

export default function TypewriterText({ segments, speed = 90, className }: TypewriterTextProps) {
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Accessibility and Intersection Observer
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    // 2. Typing Engine
    useEffect(() => {
        if (!hasStarted || isComplete || prefersReducedMotion) {
            if (prefersReducedMotion) setIsComplete(true);
            return;
        }

        const currentSegment = segments[currentSegmentIndex];

        if (!currentSegment) {
            setIsComplete(true);
            return;
        }

        if (currentCharIndex < currentSegment.text.length) {
            const timeout = setTimeout(() => {
                setCurrentCharIndex(prev => prev + 1);
            }, speed + (Math.random() * 20 - 10)); // Add slight human variance
            return () => clearTimeout(timeout);
        } else {
            if (currentSegmentIndex < segments.length - 1) {
                const timeout = setTimeout(() => {
                    setCurrentSegmentIndex(prev => prev + 1);
                    setCurrentCharIndex(0);
                }, 200); // Pause before next line
                return () => clearTimeout(timeout);
            } else {
                setIsComplete(true);
            }
        }
    }, [hasStarted, currentSegmentIndex, currentCharIndex, segments, speed, isComplete, prefersReducedMotion]);

    // 3. Cursor fade-out delay
    useEffect(() => {
        if (isComplete && !prefersReducedMotion) {
            const timeout = setTimeout(() => setShowCursor(false), 2500);
            return () => clearTimeout(timeout);
        }
        if (prefersReducedMotion) setShowCursor(false);
    }, [isComplete, prefersReducedMotion]);

    const renderPlaceholder = () => (
        segments.map((seg, i) => (
            <span key={`ph-${i}`} className={`${seg.className || ""} ${seg.isBlock ? "block" : ""}`}>
                {seg.text}
            </span>
        ))
    );

    const renderTypedText = () => {
        if (prefersReducedMotion) return renderPlaceholder();

        return segments.map((seg, i) => {
            if (i > currentSegmentIndex) return null;

            const isCurrentSegment = i === currentSegmentIndex;
            const textToShow = i < currentSegmentIndex ? seg.text : seg.text.substring(0, currentCharIndex);
            const showCursorHere = (isCurrentSegment || (isComplete && i === segments.length - 1)) && showCursor;

            return (
                <span key={`typed-${i}`} className={`${seg.className || ""} ${seg.isBlock ? "block" : ""}`}>
                    {textToShow}
                    {showCursorHere && (
                        <span className="inline-block animate-pulse font-normal text-current opacity-80" style={{ animationDuration: '0.8s' }}>|</span>
                    )}
                </span>
            );
        });
    };

    return (
        <div ref={containerRef} className={`relative ${className || ""}`}>
            {/* Invisible Placeholder to strictly enforce layout constraints and prevent reflow */}
            <div className="invisible pointer-events-none" aria-hidden="true">
                {renderPlaceholder()}
            </div>

            {/* Absolute Visible Typing Layer */}
            <div className="absolute inset-0 top-0 left-0">
                {renderTypedText()}
            </div>
        </div>
    );
}
