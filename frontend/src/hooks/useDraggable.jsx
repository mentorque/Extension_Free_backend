// src/hooks/useDraggable.jsx
import { useState, useEffect, useCallback } from 'react';

export const getOverlayPosition = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const savedPosition = localStorage.getItem("overlayPosition");
            return savedPosition ? JSON.parse(savedPosition) : null;
        } catch (error) {
            console.error('Error loading overlay position:', error);
            return null;
        }
    }
    return null;
};

export const saveOverlayPosition = (position) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            localStorage.setItem("overlayPosition", JSON.stringify(position));
        } catch (error) {
            console.error('Error saving overlay position:', error);
        }
    }
};

const useDraggable = (overlayRef) => {
    const [position, setPosition] = useState({ top: 20, right: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const savedPosition = getOverlayPosition();
        if (savedPosition) {
            setPosition(savedPosition);
        }
    }, []);

    useEffect(() => {
        saveOverlayPosition(position);
    }, [position]);

    const handleMouseDown = (e) => {
        if (e.button !== 0 || !overlayRef.current) return;
        setIsDragging(true);
        const overlayRect = overlayRef.current.getBoundingClientRect();
        setOffset({
            x: e.clientX - overlayRect.left,
            y: e.clientY - overlayRect.top,
        });
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !overlayRef.current) return;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const overlayWidth = overlayRef.current.offsetWidth;
        const overlayHeight = overlayRef.current.offsetHeight;

        let newLeft = e.clientX - offset.x;
        let newTop = e.clientY - offset.y;

        newLeft = Math.max(20, Math.min(newLeft, windowWidth - overlayWidth - 20));
        newTop = Math.max(20, Math.min(newTop, windowHeight - overlayHeight - 20));

        const newRight = windowWidth - (newLeft + overlayWidth);
        setPosition({ top: newTop, right: newRight });
    }, [isDragging, offset, overlayRef]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return { position, isDragging, handleMouseDown };
};

export default useDraggable;