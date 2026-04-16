"use client";

import { useEffect, useRef } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
} from "three";

export default function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent background
    mountRef.current.appendChild(renderer.domElement);

    // fix 2 — pause loop when hero not visible
let isVisible = true;
const observer = new IntersectionObserver(
  ([entry]) => { isVisible = entry.isIntersecting; },
  { threshold: 0.1 }
);
if (mountRef.current.parentElement) {
  observer.observe(mountRef.current.parentElement);
}

    // Create particles
    const particleCount = 3000;
    const geometry = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spread particles across screen
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      // Gold and white color mix — luxury feel
      const isGold = Math.random() > 0.5;
      colors[i * 3] = isGold ? 1.0 : 1.0;
      colors[i * 3 + 1] = isGold ? 0.84 : 1.0;
      colors[i * 3 + 2] = isGold ? 0.0 : 1.0;
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return; // skip render when off screen
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
}