"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type LazySectionProps = {
  children: ReactNode;
  placeholderHeight?: string;
  rootMargin?: string;
  id?: string;
};

export default function LazySection({
  children,
  placeholderHeight = "60vh",
  rootMargin = "300px 0px",
  id,
}: LazySectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={wrapperRef} id={id}>
      {isVisible ? children : <div style={{ minHeight: placeholderHeight }} aria-hidden="true" />}
    </div>
  );
}
