import { useState, useRef, useEffect } from 'react';

export function useResizablePanel(initialHeight = 240, maxHeight = 500) {
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Calculate minimum height (10% of viewport or 80px, whichever is larger)
  const getMinHeight = () => Math.max(window.innerHeight * 0.1, 80);

  useEffect(() => {
    const handleResize = () => {
      const newMinHeight = getMinHeight();
      if (panelHeight < newMinHeight) {
        setPanelHeight(newMinHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [panelHeight]);

  const handleMouseDown = (e) => {
    resizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizingRef.current) return;
    const delta = startYRef.current - e.clientY;
    const newHeight = Math.min(
      Math.max(getMinHeight(), startHeightRef.current + delta),
      maxHeight
    );
    setPanelHeight(newHeight);
  };

  const handleMouseUp = () => {
    resizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return {
    panelHeight,
    handleMouseDown,
    resizeHandleProps: {
      className: "h-1 bg-[#242424] hover:bg-blue-500/20 cursor-ns-resize flex items-center justify-center group",
      onMouseDown: handleMouseDown,
    },
    panelProps: {
      style: { height: `${panelHeight}px` },
      className: "transition-all duration-150",
    }
  };
} 