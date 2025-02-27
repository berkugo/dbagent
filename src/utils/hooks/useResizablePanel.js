import { useState, useRef, useEffect } from 'react';

export function useResizablePanel({ initialHeight = 300, minHeight = 200, maxHeight = 500 } = {}) {
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(initialHeight);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      const deltaY = e.clientY - startY.current;
      const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight.current - deltaY));
      
      setPanelHeight(newHeight);
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
  }, [minHeight, maxHeight]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startHeight.current = panelHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const resizeHandleProps = {
    className: "flex justify-center items-center h-6 cursor-ns-resize group",
    onMouseDown: handleMouseDown,
  };

  const panelProps = {
    style: { height: `${panelHeight}px` },
  };

  return { panelHeight, resizeHandleProps, panelProps };
} 