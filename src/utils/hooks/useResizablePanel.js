import { useState, useRef, useEffect } from 'react';

export function useResizablePanel({ 
  initialHeight = 250,
  minHeight = 150,
  maxHeight = 500,
  isHorizontal = false,
  initialWidth = 350,
  minWidth = 250,
  maxWidth = 600
} = {}) {
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startX = useRef(0);
  const startHeight = useRef(initialHeight);
  const startWidth = useRef(initialWidth);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      if (isHorizontal) {
        const deltaX = e.clientX - startX.current;
        const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current - deltaX));
        setPanelWidth(newWidth);
      } else {
        const deltaY = e.clientY - startY.current;
        const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight.current - deltaY));
        setPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minHeight, maxHeight, minWidth, maxWidth, isHorizontal]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    
    if (isHorizontal) {
      startX.current = e.clientX;
      startWidth.current = panelWidth;
      document.body.style.cursor = 'ew-resize';
    } else {
      startY.current = e.clientY;
      startHeight.current = panelHeight;
      document.body.style.cursor = 'ns-resize';
    }
    
    document.body.style.userSelect = 'none';
  };

  const resizeHandleProps = {
    className: isHorizontal 
      ? "h-full cursor-ew-resize group" 
      : "flex justify-center items-center h-6 cursor-ns-resize group",
    onMouseDown: handleMouseDown,
  };

  const panelProps = {
    style: isHorizontal 
      ? { width: `${panelWidth}px` } 
      : { height: `${panelHeight}px` },
  };

  return { panelHeight, panelWidth, resizeHandleProps, panelProps };
} 