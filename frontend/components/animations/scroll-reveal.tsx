"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollReveal({ 
    children, 
    className = "", 
    delay = 0,
    direction = "up"
}: ScrollRevealProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    const directionOffset = {
        up: 40,
        down: -40,
        left: 40,
        right: -40,
        none: 0,
    };

    const initialY = direction === "up" || direction === "down" ? directionOffset[direction] : 0;
    const initialX = direction === "left" || direction === "right" ? directionOffset[direction] : 0;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: initialY, x: initialX }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.7,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            {children}
        </motion.div>
    );
}
