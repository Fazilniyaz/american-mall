"use client";

import { useEffect, useRef } from "react";
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    BufferGeometry, BufferAttribute, Mesh, MeshBasicMaterial, MeshStandardMaterial,
    BoxGeometry, CylinderGeometry, SphereGeometry, ConeGeometry,
    DirectionalLight, AmbientLight, SpotLight,
    Color as ThreeColor, Vector3,
    Group, Line, LineBasicMaterial,
    Float32BufferAttribute, Points, PointsMaterial,
} from "three";

export default function EventsScene({ isMobile }: { isMobile: boolean }) {
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
        const camera = new PerspectiveCamera(55, W / H, 0.1, 100);
        camera.position.set(0, 3, 12);
        camera.lookAt(0, 0, 0);

        scene.add(new AmbientLight(0x060006, 2.5));

        const stageMat = new MeshStandardMaterial({ color: 0x0d0008, roughness: 0.5, metalness: 0.5 });
        const stage = new Mesh(new BoxGeometry(14, 0.3, 5), stageMat);
        stage.position.y = -3;
        scene.add(stage);

        const edge = new Mesh(new BoxGeometry(14.1, 0.06, 0.06), new MeshBasicMaterial({ color: 0xC9A84C }));
        edge.position.set(0, -2.82, 2.55);
        scene.add(edge);

        const crowdMat = new MeshBasicMaterial({ color: 0x0a0008 });
        for (let i = -6; i <= 6; i += 1.1) {
            for (let row = 0; row < 3; row++) {
                const h = 0.8 + Math.random() * 0.5;
                const person = new Mesh(new CylinderGeometry(0.2, 0.25, h, 5), crowdMat);
                person.position.set(i + (Math.random() - 0.5) * 0.4, -3 + h / 2, 4 + row * 1.4 + (Math.random() - 0.5) * 0.3);
                scene.add(person);
                const head = new Mesh(new SphereGeometry(0.22, 5, 4), crowdMat);
                head.position.set(person.position.x, person.position.y + h / 2 + 0.18, person.position.z);
                scene.add(head);
            }
        }

        type SpotRig = { light: SpotLight; cone: Mesh; phase: number; speed: number };
        const spotRigs: SpotRig[] = [];
        const spotColors = [0xffaaff, 0xaaffff, 0xffffaa, 0xC9A84C, 0xff88aa];
        const coneGeo = new ConeGeometry(1.8, 7, 10, 1, true);
        const coneMatBase = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: 2 });

        for (let i = 0; i < (isMobile ? 3 : 5); i++) {
            const spot = new SpotLight(spotColors[i], 3.5, 20, Math.PI / 7, 0.4, 1);
            const xPos = -5 + i * 2.5;
            spot.position.set(xPos, 8, -2);
            spot.target.position.set(0, -3, 0);
            scene.add(spot);
            scene.add(spot.target);

            const coneMat = coneMatBase.clone();
            const cone = new Mesh(coneGeo, coneMat);
            cone.position.copy(spot.position);
            cone.rotation.x = Math.PI;
            scene.add(cone);

            spotRigs.push({ light: spot, cone, phase: (i / 5) * Math.PI * 2, speed: 0.4 + Math.random() * 0.3 });
        }

        const confettiCount = isMobile ? 120 : 300;
        const cPos = new Float32Array(confettiCount * 3);
        const cVels = new Float32Array(confettiCount * 3);
        const cCols = new Float32Array(confettiCount * 3);
        const confColors = [
            new ThreeColor(0xC9A84C), new ThreeColor(0xff4488),
            new ThreeColor(0x44aaff), new ThreeColor(0xffffff), new ThreeColor(0x88ff44),
        ];
        for (let i = 0; i < confettiCount; i++) {
            cPos[i * 3] = (Math.random() - 0.5) * 16;
            cPos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 2;
            cPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
            cVels[i * 3] = (Math.random() - 0.5) * 0.015;
            cVels[i * 3 + 1] = -0.02 - Math.random() * 0.025;
            cVels[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
            const col = confColors[Math.floor(Math.random() * confColors.length)];
            cCols[i * 3] = col.r; cCols[i * 3 + 1] = col.g; cCols[i * 3 + 2] = col.b;
        }
        const confGeo = new BufferGeometry();
        confGeo.setAttribute("position", new Float32BufferAttribute(cPos, 3));
        confGeo.setAttribute("color", new Float32BufferAttribute(cCols, 3));
        scene.add(new Points(confGeo, new PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.85 })));

        const laserColors = [0xff00aa, 0x00ffaa, 0xC9A84C];
        const lasers: { line: Line; phase: number }[] = [];
        for (let i = 0; i < (isMobile ? 2 : 4); i++) {
            const pts = [new Vector3(0, 7, 0), new Vector3((Math.random() - 0.5) * 10, -2, 0)];
            const lGeo = new BufferGeometry().setFromPoints(pts);
            const laser = new Line(lGeo, new LineBasicMaterial({ color: laserColors[i % laserColors.length], transparent: true, opacity: 0.35 }));
            scene.add(laser);
            lasers.push({ line: laser, phase: Math.random() * Math.PI * 2 });
        }

        let frame = 0;
        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            if (!isVis.current) return;
            frame++;
            const t = frame * 0.016;

            spotRigs.forEach(({ light, cone, phase, speed }) => {
                const sweep = Math.sin(t * speed + phase) * 5;
                light.target.position.x = sweep;
                light.target.updateMatrixWorld();
                cone.lookAt(light.target.position);
                light.intensity = 2.5 + Math.sin(t * 2 + phase) * 0.8;
            });

            if (frame % 2 === 0) {
                for (let i = 0; i < confettiCount; i++) {
                    cPos[i * 3] += cVels[i * 3] + Math.sin(t + i * 0.5) * 0.003;
                    cPos[i * 3 + 1] += cVels[i * 3 + 1];
                    cPos[i * 3 + 2] += cVels[i * 3 + 2];
                    if (cPos[i * 3 + 1] < -6) {
                        cPos[i * 3] = (Math.random() - 0.5) * 16;
                        cPos[i * 3 + 1] = 6 + Math.random() * 4;
                        cPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
                    }
                }
                confGeo.attributes.position.needsUpdate = true;
            }

            lasers.forEach(({ line, phase }) => {
                const pts = line.geometry.attributes.position as BufferAttribute;
                pts.setX(1, Math.sin(t * 1.2 + phase) * 8);
                pts.setY(1, -2 + Math.cos(t * 0.7 + phase) * 1);
                pts.needsUpdate = true;
            });

            camera.position.x = Math.sin(t * 0.1) * 1.2;
            camera.position.y = 3 + Math.sin(t * 0.07) * 0.4;
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
            confGeo.dispose(); coneGeo.dispose(); coneMatBase.dispose();
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}