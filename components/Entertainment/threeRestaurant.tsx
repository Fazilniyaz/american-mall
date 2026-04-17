"use client";

import { useEffect, useRef } from "react";
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    BufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    BoxGeometry, CylinderGeometry, TorusGeometry, PlaneGeometry,
    DirectionalLight, AmbientLight, PointLight,
    Group, Float32BufferAttribute, Points, PointsMaterial,
} from "three";

export default function RestaurantScene({ isMobile }: { isMobile: boolean }) {
    const mountRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;

        const W = el.clientWidth;
        const H = el.clientHeight;
        const renderer = new WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);

        const isVis = { current: true };
        const obs = new IntersectionObserver(([e]) => { isVis.current = e.isIntersecting; }, { threshold: 0.05 });
        obs.observe(el);

        const scene = new Scene();
        const camera = new PerspectiveCamera(52, W / H, 0.1, 100);
        camera.position.set(0, 1, 10);
        camera.lookAt(0, 0, 0);

        scene.add(new AmbientLight(0x1a0800, 3));
        const keyLight = new DirectionalLight(0xffd080, 1.8);
        keyLight.position.set(3, 8, 5);
        scene.add(keyLight);

        const candleLights: PointLight[] = [];
        const candlePositions = [[-2.5, -1.5], [0, -1.5], [2.5, -1.5], [-1.2, 0.5], [1.2, 0.5]];
        candlePositions.forEach(([x, z]) => {
            const pl = new PointLight(0xff8820, 0.9, 6);
            pl.position.set(x, 0, z);
            scene.add(pl);
            candleLights.push(pl);
        });

        const table = new Mesh(new BoxGeometry(12, 0.08, 5), new MeshStandardMaterial({ color: 0x1a0d04, roughness: 0.3, metalness: 0.4 }));
        table.position.y = -1.8;
        scene.add(table);

        const cloth = new Mesh(new BoxGeometry(11.5, 0.02, 4.5), new MeshStandardMaterial({ color: 0x0d0906, roughness: 0.9 }));
        cloth.position.y = -1.74;
        scene.add(cloth);

        const glassMat = new MeshStandardMaterial({ color: 0xc8e8ff, roughness: 0.0, transparent: true, opacity: 0.22 });
        const wineMat = new MeshStandardMaterial({ color: 0x8b0000, roughness: 0.4, transparent: true, opacity: 0.7 });
        const stemMat = new MeshStandardMaterial({ color: 0xb8d8f0, roughness: 0.0, transparent: true, opacity: 0.18 });

        type WineGlass = { group: Group; baseY: number; phase: number };
        const glasses: WineGlass[] = [];

        const glassPositions = [
            [-3.5, -1.72, -0.8], [-1.2, -1.72, -0.8], [1.2, -1.72, -0.8], [3.5, -1.72, -0.8],
            [-2.4, -1.72, 0.8], [0, -1.72, 0.8], [2.4, -1.72, 0.8],
        ];

        glassPositions.forEach(([x, y, z]) => {
            const group = new Group();
            const bowl = new Mesh(new CylinderGeometry(0.22, 0.10, 0.55, 12, 1, true), glassMat);
            bowl.position.y = 0.55;
            group.add(bowl);
            const wine = new Mesh(new CylinderGeometry(0.19, 0.09, 0.28, 12), wineMat);
            wine.position.y = 0.4;
            group.add(wine);
            const rim = new Mesh(new TorusGeometry(0.22, 0.012, 6, 20), glassMat);
            rim.position.y = 0.83;
            group.add(rim);
            const stem = new Mesh(new CylinderGeometry(0.018, 0.018, 0.6, 6), stemMat);
            stem.position.y = 0.13;
            group.add(stem);
            const base = new Mesh(new CylinderGeometry(0.18, 0.2, 0.04, 12), glassMat);
            base.position.y = -0.18;
            group.add(base);
            group.position.set(x, y, z);
            scene.add(group);
            glasses.push({ group, baseY: y, phase: Math.random() * Math.PI * 2 });
        });

        const candleBodyMat = new MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.9 });
        const candleFlames: Mesh[] = [];
        candlePositions.forEach(([x, z]) => {
            const candle = new Mesh(new CylinderGeometry(0.055, 0.055, 0.55, 8), candleBodyMat);
            candle.position.set(x, -1.5, z);
            scene.add(candle);
            const flame = new Mesh(new CylinderGeometry(0, 0.038, 0.18, 6), new MeshBasicMaterial({ color: 0xff9030 }));
            flame.position.set(x, -1.18, z);
            flame.userData.phase = Math.random() * Math.PI * 2;
            scene.add(flame);
            candleFlames.push(flame);
        });

        const steamCount = isMobile ? 40 : 100;
        const sPos = new Float32Array(steamCount * 3);
        const sVels = new Float32Array(steamCount);
        const sPhases = new Float32Array(steamCount);
        for (let i = 0; i < steamCount; i++) {
            sPos[i * 3] = (Math.random() - 0.5) * 8;
            sPos[i * 3 + 1] = -1.5 + Math.random() * 4;
            sPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
            sVels[i] = 0.008 + Math.random() * 0.012;
            sPhases[i] = Math.random() * Math.PI * 2;
        }
        const steamGeo = new BufferGeometry();
        steamGeo.setAttribute("position", new Float32BufferAttribute(sPos, 3));
        scene.add(new Points(steamGeo, new PointsMaterial({ color: 0xfff0d0, size: 0.08, transparent: true, opacity: 0.18 })));

        const sparkCount = isMobile ? 60 : 150;
        const spPos = new Float32Array(sparkCount * 3);
        for (let i = 0; i < sparkCount; i++) {
            spPos[i * 3] = (Math.random() - 0.5) * 12;
            spPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
            spPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        const sparkGeo = new BufferGeometry();
        sparkGeo.setAttribute("position", new Float32BufferAttribute(spPos, 3));
        scene.add(new Points(sparkGeo, new PointsMaterial({ color: 0xffa840, size: 0.05, transparent: true, opacity: 0.35 })));

        let frame = 0;
        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            if (!isVis.current) return;
            frame++;
            const t = frame * 0.016;

            candleLights.forEach((pl, i) => {
                pl.intensity = 0.7 + Math.sin(t * 6 + i * 1.3) * 0.25 + Math.sin(t * 11 + i) * 0.1;
            });
            candleFlames.forEach(f => {
                f.scale.x = 0.85 + Math.sin(t * 7 + f.userData.phase) * 0.2;
                f.scale.z = 0.85 + Math.cos(t * 9 + f.userData.phase) * 0.15;
            });

            glasses.forEach(({ group, baseY, phase }) => {
                group.position.y = baseY + Math.sin(t * 0.5 + phase) * 0.015;
                group.rotation.z = Math.sin(t * 0.3 + phase) * 0.008;
            });

            if (frame % 2 === 0) {
                for (let i = 0; i < steamCount; i++) {
                    sPos[i * 3 + 1] += sVels[i];
                    sPos[i * 3] += Math.sin(t * 0.8 + sPhases[i]) * 0.003;
                    if (sPos[i * 3 + 1] > 3) {
                        sPos[i * 3 + 1] = -1.5;
                        sPos[i * 3] = (Math.random() - 0.5) * 8;
                    }
                }
                steamGeo.attributes.position.needsUpdate = true;
            }

            camera.position.x = Math.sin(t * 0.08) * 0.8;
            camera.position.y = 1 + Math.sin(t * 0.05) * 0.3;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize, { passive: true });

        return () => {
            cancelAnimationFrame(rafRef.current);
            obs.disconnect();
            window.removeEventListener("resize", onResize);
            steamGeo.dispose(); sparkGeo.dispose();
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}