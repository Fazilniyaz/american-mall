"use client";

import { useEffect, useRef } from "react";
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    BufferGeometry, BufferAttribute, Mesh, MeshStandardMaterial,
    BoxGeometry, CylinderGeometry, SphereGeometry,
    ConeGeometry, PlaneGeometry,
    DirectionalLight, AmbientLight, PointLight,
    Group, Float32BufferAttribute, Points, PointsMaterial,
} from "three";

export default function AquariumScene({ isMobile }: { isMobile: boolean }) {
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
        const camera = new PerspectiveCamera(60, W / H, 0.1, 100);
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);

        scene.add(new AmbientLight(0x001a2a, 4));
        const keyLight = new DirectionalLight(0x00c8ff, 1.5);
        keyLight.position.set(0, 8, 4);
        scene.add(keyLight);
        scene.add(Object.assign(new DirectionalLight(0x004466, 0.8), { position: { x: -5, y: -2, z: -5, set(a: number, b: number, c: number) { this.x = a; this.y = b; this.z = c; } } }));
        const fillLight = new DirectionalLight(0x004466, 0.8);
        fillLight.position.set(-5, -2, -5);
        scene.add(fillLight);

        const causticLights: PointLight[] = [];
        for (let i = 0; i < 4; i++) {
            const pl = new PointLight(0x00aaff, 0.6, 15);
            pl.position.set((Math.random() - 0.5) * 8, 4, (Math.random() - 0.5) * 4);
            scene.add(pl);
            causticLights.push(pl);
        }

        const waterSegs = isMobile ? 20 : 40;
        const waterGeo = new PlaneGeometry(20, 20, waterSegs, waterSegs);
        const waterMesh = new Mesh(waterGeo, new MeshStandardMaterial({
            color: 0x003a5c, roughness: 0.1, transparent: true, opacity: 0.35,
        }));
        waterMesh.rotation.x = -Math.PI / 2;
        waterMesh.position.y = 3.5;
        scene.add(waterMesh);

        const bubbleCount = isMobile ? 80 : 200;
        const bPos = new Float32Array(bubbleCount * 3);
        const bVels = new Float32Array(bubbleCount);
        for (let i = 0; i < bubbleCount; i++) {
            bPos[i * 3] = (Math.random() - 0.5) * 14;
            bPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            bPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
            bVels[i] = 0.01 + Math.random() * 0.025;
        }
        const bubbleGeo = new BufferGeometry();
        bubbleGeo.setAttribute("position", new Float32BufferAttribute(bPos, 3));
        scene.add(new Points(bubbleGeo, new PointsMaterial({ color: 0x80e8ff, size: 0.07, transparent: true, opacity: 0.5 })));

        const FISH_SCHOOLS = [
            { count: isMobile ? 8 : 18, color: 0xffa830, size: [0.35, 0.1, 0.18] as [number, number, number], radius: 3.5, speed: 0.008, yBase: 0.5 },
            { count: isMobile ? 6 : 14, color: 0x00cfff, size: [0.22, 0.07, 0.12] as [number, number, number], radius: 2.5, speed: 0.011, yBase: -1.5 },
            { count: isMobile ? 5 : 10, color: 0xff6644, size: [0.18, 0.06, 0.10] as [number, number, number], radius: 4.2, speed: 0.006, yBase: 1.5 },
        ];

        type School = { meshes: Mesh[]; angles: number[]; cfg: typeof FISH_SCHOOLS[0] };
        const schools: School[] = [];

        FISH_SCHOOLS.forEach(cfg => {
            const school: School = { meshes: [], angles: [], cfg };
            const fishMat = new MeshStandardMaterial({ color: cfg.color, roughness: 0.6, metalness: 0.1 });
            const group = new Group();
            for (let i = 0; i < cfg.count; i++) {
                const fish = new Mesh(new BoxGeometry(...cfg.size), fishMat);
                const tail = new Mesh(new ConeGeometry(cfg.size[1] * 0.8, cfg.size[0] * 0.4, 4), fishMat);
                tail.rotation.z = Math.PI / 2;
                tail.position.x = -cfg.size[0] * 0.65;
                fish.add(tail);
                const angle = (i / cfg.count) * Math.PI * 2;
                fish.position.set(
                    Math.cos(angle) * cfg.radius + (Math.random() - 0.5) * 1.2,
                    cfg.yBase + (Math.random() - 0.5) * 2,
                    Math.sin(angle) * cfg.radius * 0.5 + (Math.random() - 0.5) * 1.5
                );
                group.add(fish);
                school.meshes.push(fish);
                school.angles.push(angle);
            }
            scene.add(group);
            schools.push(school);
        });

        const weedMat = new MeshStandardMaterial({ color: 0x1a5c2a, roughness: 0.9 });
        const weedMeshes: Mesh[] = [];
        for (let i = 0; i < (isMobile ? 6 : 14); i++) {
            const h = 1.2 + Math.random() * 1.8;
            const weed = new Mesh(new CylinderGeometry(0.04, 0.07, h, 5), weedMat);
            weed.position.set((Math.random() - 0.5) * 14, -5 + h / 2, (Math.random() - 0.5) * 5);
            weed.userData.phase = Math.random() * Math.PI * 2;
            scene.add(weed);
            weedMeshes.push(weed);
        }

        const sand = new Mesh(new PlaneGeometry(20, 10), new MeshStandardMaterial({ color: 0x1a1205, roughness: 1.0 }));
        sand.rotation.x = -Math.PI / 2;
        sand.position.y = -5;
        scene.add(sand);

        let frame = 0;
        const waterPositions = waterGeo.attributes.position as BufferAttribute;
        const waterOrigY = new Float32Array(waterPositions.count);
        for (let i = 0; i < waterPositions.count; i++) waterOrigY[i] = waterPositions.getY(i);

        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            if (!isVis.current) return;
            frame++;
            const t = frame * 0.016;

            if (frame % 2 === 0) {
                for (let i = 0; i < waterPositions.count; i++) {
                    const x = waterPositions.getX(i);
                    const z = waterPositions.getZ(i);
                    waterPositions.setY(i, waterOrigY[i] + Math.sin(x * 0.8 + t) * 0.15 + Math.cos(z * 0.6 + t * 0.8) * 0.1);
                }
                waterPositions.needsUpdate = true;
                waterGeo.computeVertexNormals();
            }

            causticLights.forEach((pl, i) => {
                pl.intensity = 0.4 + Math.sin(t * 1.5 + i * 1.2) * 0.3;
                pl.position.x += Math.sin(t * 0.3 + i) * 0.01;
            });

            if (frame % 2 === 0) {
                for (let i = 0; i < bubbleCount; i++) {
                    bPos[i * 3 + 1] += bVels[i];
                    if (bPos[i * 3 + 1] > 5) bPos[i * 3 + 1] = -5;
                    bPos[i * 3] += Math.sin(t + i) * 0.003;
                }
                bubbleGeo.attributes.position.needsUpdate = true;
            }

            schools.forEach(({ meshes, angles, cfg }) => {
                angles.forEach((angle, i) => {
                    angles[i] += cfg.speed + Math.sin(t + i) * 0.001;
                    const a = angles[i];
                    const wobbly = Math.sin(t * 2 + i * 0.5) * 0.3;
                    meshes[i].position.x = Math.cos(a) * cfg.radius + wobbly;
                    meshes[i].position.y = cfg.yBase + Math.sin(t * 0.5 + i) * 0.8;
                    meshes[i].position.z = Math.sin(a) * cfg.radius * 0.5;
                    meshes[i].rotation.y = -a + Math.PI / 2;
                    meshes[i].rotation.z = Math.sin(t * 3 + i) * 0.1;
                });
            });

            weedMeshes.forEach(w => { w.rotation.z = Math.sin(t * 0.8 + w.userData.phase) * 0.12; });

            camera.position.x = Math.sin(t * 0.12) * 1.5;
            camera.position.y = Math.sin(t * 0.08) * 0.5;
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
            waterGeo.dispose(); bubbleGeo.dispose();
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}