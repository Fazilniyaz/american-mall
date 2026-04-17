"use client";

import { useEffect, useRef } from "react";
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    BufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    BoxGeometry, CylinderGeometry, TorusGeometry,
    TubeGeometry, CatmullRomCurve3, Vector3,
    DirectionalLight, AmbientLight,
    Group, LineBasicMaterial, Line,
    Float32BufferAttribute, Points, PointsMaterial,
} from "three";

export default function RollerCoasterScene({ isMobile }: { isMobile: boolean }) {
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
        const camera = new PerspectiveCamera(55, W / H, 0.1, 200);
        camera.position.set(0, 4, 14);
        camera.lookAt(0, 0, 0);

        scene.add(new AmbientLight(0x0a0600, 3));
        const sun = new DirectionalLight(0xffa040, 2.5);
        sun.position.set(5, 10, 5);
        scene.add(sun);
        const fill = new DirectionalLight(0x200800, 1);
        fill.position.set(-5, 3, -5);
        scene.add(fill);

        const trackPoints = [
            new Vector3(-8, 0, 0), new Vector3(-6, 2, -3), new Vector3(-3, 5, -5),
            new Vector3(0, 8, -4), new Vector3(3, 5, -3), new Vector3(5, 1, 0),
            new Vector3(6, 3, 3), new Vector3(4, 6, 5), new Vector3(0, 4, 6),
            new Vector3(-4, 1, 4), new Vector3(-7, 0, 2), new Vector3(-8, 0, 0),
        ];
        const curve = new CatmullRomCurve3(trackPoints, true, "catmullrom", 0.5);

        const tubeGeo = new TubeGeometry(curve, isMobile ? 80 : 150, 0.07, 6, true);
        const tubeMat = new MeshStandardMaterial({ color: 0x3a2a08, roughness: 0.6, metalness: 0.8 });
        scene.add(new Mesh(tubeGeo, tubeMat));

        for (const offset of [-0.12, 0.12]) {
            const railPoints = curve.getPoints(isMobile ? 80 : 160).map(p => new Vector3(p.x + offset, p.y, p.z));
            const railGeo = new BufferGeometry().setFromPoints(railPoints);
            scene.add(new Line(railGeo, new LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.7 })));
        }

        const towerMat = new MeshStandardMaterial({ color: 0x1a1005, roughness: 0.8, metalness: 0.3 });
        const towerPositions: [number, number, number][] = [
            [-6, 2, -3], [-3, 5, -5], [0, 8, -4], [3, 5, -3], [6, 3, 3], [4, 6, 5],
        ];
        towerPositions.forEach(([x, topY, z]) => {
            const h = topY + 0.5;
            scene.add(Object.assign(new Mesh(new CylinderGeometry(0.06, 0.1, h, 5), towerMat), {
                position: { x, y: topY / 2 - 0.5, z, set(a: number, b: number, c: number) { this.x = a; this.y = b; this.z = c; } }
            }));
            const tower = new Mesh(new CylinderGeometry(0.06, 0.1, h, 5), towerMat);
            tower.position.set(x, topY / 2 - 0.5, z);
            scene.add(tower);
        });

        const loop = new Mesh(new TorusGeometry(2.8, 0.06, 6, isMobile ? 24 : 40),
            new MeshStandardMaterial({ color: 0x2a1c05, roughness: 0.5, metalness: 0.7 }));
        loop.position.set(0, 4, -4);
        loop.rotation.y = Math.PI / 2;
        scene.add(loop);

        const cartGroup = new Group();
        const cartBody = new Mesh(new BoxGeometry(0.5, 0.22, 0.28),
            new MeshStandardMaterial({ color: 0xC9A84C, roughness: 0.3, metalness: 0.7 }));
        cartGroup.add(cartBody);

        const winMat = new MeshBasicMaterial({ color: 0x80d4ff, transparent: true, opacity: 0.5 });
        [-0.12, 0.12].forEach(x => {
            const win = new Mesh(new BoxGeometry(0.04, 0.1, 0.14), winMat);
            win.position.set(x, 0.06, 0.1);
            cartGroup.add(win);
        });
        scene.add(cartGroup);

        const trailCount = isMobile ? 40 : 80;
        const trailPos = new Float32Array(trailCount * 3);
        const trailGeo = new BufferGeometry();
        trailGeo.setAttribute("position", new Float32BufferAttribute(trailPos, 3));
        const trail = new Points(trailGeo, new PointsMaterial({ color: 0xffa040, size: 0.12, transparent: true, opacity: 0.6 }));
        scene.add(trail);

        const ambCount = isMobile ? 200 : 500;
        const ambPos = new Float32Array(ambCount * 3);
        for (let i = 0; i < ambCount; i++) {
            ambPos[i * 3] = (Math.random() - 0.5) * 20;
            ambPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
            ambPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
        }
        const ambGeo = new BufferGeometry();
        ambGeo.setAttribute("position", new Float32BufferAttribute(ambPos, 3));
        scene.add(new Points(ambGeo, new PointsMaterial({ color: 0xC9A84C, size: 0.06, transparent: true, opacity: 0.25 })));

        let t = 0;
        let trailIdx = 0;
        const cartPrev = new Vector3();

        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            if (!isVis.current) return;
            t += 0.003;
            const pos = curve.getPoint(t % 1);
            const ahead = curve.getPoint((t + 0.005) % 1);
            cartGroup.position.copy(pos);
            cartGroup.lookAt(ahead);

            trailPos[trailIdx * 3] = cartPrev.x;
            trailPos[trailIdx * 3 + 1] = cartPrev.y;
            trailPos[trailIdx * 3 + 2] = cartPrev.z;
            trailGeo.attributes.position.needsUpdate = true;
            trailIdx = (trailIdx + 1) % trailCount;
            cartPrev.copy(pos);

            camera.position.x = Math.sin(t * 0.4) * 2;
            camera.lookAt(0, 1.5, 0);
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
            tubeGeo.dispose(); tubeMat.dispose();
            trailGeo.dispose(); ambGeo.dispose();
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}