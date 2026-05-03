"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";

// GSAP type no longer needed for sub-components — kept only for type safety
type GsapInstance = typeof import("gsap").default;


// ─── Floor data ───────────────────────────────────────────────────────────────
const FLOORS = [
  {
    id: 0,
    label: "Floor 1",
    name: "Retail & Flagship",
    color: "#C9A84C",
    dimColor: "#3A2E10",
    glowColor: "#C9A84C",
    zones: [
      { label: "Flagship Stores", pct: 42, color: "#C9A84C" },
      { label: "Dining", pct: 28, color: "#A67C32" },
      { label: "Entertainment", pct: 18, color: "#7A5C1E" },
      { label: "Services", pct: 12, color: "#4A3810" },
    ],
    tenants: ["Samsung", "Apple", "Nike", "Microsoft"],
    stat: "180+ stores",
  },
  {
    id: 1,
    label: "Floor 2",
    name: "Fashion & Luxury",
    color: "#B8922E",
    dimColor: "#2E2408",
    glowColor: "#D4AF37",
    zones: [
      { label: "Luxury Brands", pct: 38, color: "#C9A84C" },
      { label: "Fashion", pct: 35, color: "#A67C32" },
      { label: "Accessories", pct: 17, color: "#7A5C1E" },
      { label: "Beauty", pct: 10, color: "#4A3810" },
    ],
    tenants: ["Coach", "Sephora", "Zara", "H&M"],
    stat: "140+ brands",
  },
  {
    id: 2,
    label: "Floor 3",
    name: "Entertainment Hub",
    color: "#A67C32",
    dimColor: "#261E06",
    glowColor: "#FFD700",
    zones: [
      { label: "Theme Park", pct: 45, color: "#C9A84C" },
      { label: "Aquarium", pct: 25, color: "#A67C32" },
      { label: "Dining", pct: 20, color: "#7A5C1E" },
      { label: "Events", pct: 10, color: "#4A3810" },
    ],
    tenants: ["Nickelodeon Universe", "Sea Life", "Mini Golf", "Theatres"],
    stat: "7 major attractions",
  },
  {
    id: 3,
    label: "Floor 4",
    name: "Dining & Events",
    color: "#8A6820",
    dimColor: "#1A1404",
    glowColor: "#FFA500",
    zones: [
      { label: "Restaurants", pct: 50, color: "#C9A84C" },
      { label: "Event Spaces", pct: 28, color: "#A67C32" },
      { label: "Food Court", pct: 14, color: "#7A5C1E" },
      { label: "Lounge", pct: 8, color: "#4A3810" },
    ],
    tenants: ["50+ Restaurants", "Event Halls", "Sky Lounge", "Pop-ups"],
    stat: "50+ dining options",
  },
];

// ─── Zone Chart — pure CSS/SVG, no D3, no GSAP ──────────────────────────────
const ZoneChart = memo(function ZoneChart({
  zones, visible,
}: { zones: (typeof FLOORS)[0]["zones"]; visible: boolean }) {
  const [val, setVal] = useState<number[]>(zones.map(() => 0));

  useEffect(() => {
    if (!visible) return;
    let start = performance.now();
    const raf = requestAnimationFrame(function animate(now) {
      const t = Math.min((now - start) / 900, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(zones.map(z => z.pct * ease));
      if (t < 1) requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(raf);
  }, [visible, zones]);

  const W = 260;
  const rowH = 28;
  const barMaxW = W - 90;
  const H = zones.length * rowH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      aria-label="Floor zone breakdown"
    >
      {zones.map((z, i) => {
        const y = i * rowH + rowH / 2;
        const barW = Math.max(0, barMaxW * (val[i] / 100));
        return (
          <g key={z.label}>
            <text x={0} y={y + 3} fontSize="7" fontWeight="500"
              fontFamily="var(--font-montserrat)" fill="rgba(255,255,255,0.48)" letterSpacing="0.05em">
              {z.label.toUpperCase()}
            </text>
            {/* Track */}
            <rect x={72} y={y - 2} width={barMaxW} height={4} rx={2} fill="rgba(255,255,255,0.05)" />
            {/* Fill bar */}
            <rect x={72} y={y - 2} width={barW} height={4} rx={2} fill="#C9A84C" />
            {/* Pct text */}
            <text x={W} y={y + 3} textAnchor="end" fontSize="7" fontWeight="700"
              fontFamily="var(--font-montserrat)" fill="#C9A84C">
              {Math.round(val[i])}%
            </text>
          </g>
        );
      })}
    </svg>
  );
});


// ─── Side panel — CSS transition, no GSAP ────────────────────────────────────
const SidePanel = memo(function SidePanel({
  floor, visible,
}: { floor: (typeof FLOORS)[0] | null; visible: boolean }) {
  const [key, setKey] = useState(0);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    if (!floor) return;
    setPanelVisible(false);
    const t = setTimeout(() => {
      setKey(k => k + 1);
      setPanelVisible(true);
    }, 30);
    return () => clearTimeout(t);
  }, [floor]);

  if (!floor) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", gap: "0.8rem", opacity: 0.3,
      }}>
        <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom,transparent,#C9A84C,transparent)" }} />
        <p style={{
          color: "#C9A84C", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)", fontWeight: 600, textAlign: "center", margin: 0
        }}>
          Select a floor<br />to explore
        </p>
        <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom,#C9A84C,transparent)" }} />
      </div>
    );
  }

  return (
    <div
      key={key}
      style={{
        padding: "0.3rem 0",
        opacity: panelVisible ? 1 : 0,
        transform: panelVisible ? "translateX(0)" : "translateX(16px)",
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        color: "#C9A84C", fontSize: "0.45rem", letterSpacing: "0.3em",
        textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 700, marginBottom: "0.15rem"
      }}>
        {floor.label}
      </div>
      <h3 style={{
        color: "#ffffff", fontSize: "clamp(0.78rem,1.4vw,0.95rem)", fontWeight: 800,
        fontFamily: "var(--font-montserrat)", margin: "0 0 0.1rem", lineHeight: 1.1
      }}>
        {floor.name}
      </h3>
      <p style={{
        color: "rgba(201,168,76,0.7)", fontSize: "0.52rem", fontFamily: "var(--font-montserrat)",
        fontWeight: 600, margin: "0 0 0.6rem", letterSpacing: "0.05em"
      }}>
        {floor.stat}
      </p>
      <ZoneChart zones={floor.zones} visible={visible} />
      <div style={{ marginTop: "0.6rem" }}>
        <p style={{
          color: "rgba(255,255,255,0.25)", fontSize: "0.42rem", letterSpacing: "0.25em",
          textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 0.3rem"
        }}>
          Key tenants
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {floor.tenants.map(t => (
            <span key={t} style={{
              background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)",
              color: "rgba(255,255,255,0.6)", fontSize: "0.44rem", fontFamily: "var(--font-montserrat)",
              fontWeight: 500, letterSpacing: "0.05em", padding: "2px 5px"
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});


// ─── Building geometry helpers ────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWindowGrid(
  THREE: any,
  floorW: number, floorH: number, floorD: number,
  cols: number, rows: number, color: number
) {
  const group = new THREE.Group();
  const winW = 0.18;
  const winH = 0.14;
  const winD = 0.01;

  // Front face windows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -floorW / 2 + (floorW / (cols + 1)) * (c + 1);
      const y = -floorH / 2 + (floorH / (rows + 1)) * (r + 1);
      const z = floorD / 2 + winD / 2;

      const geo = new THREE.BoxGeometry(winW, winH, winD);
      const mat = new THREE.MeshBasicMaterial({ color });
      const win = new THREE.Mesh(geo, mat);
      win.position.set(x, y, z);
      win.userData.isWindow = true;
      group.add(win);

      // Mirror on back face
      const winB = win.clone();
      winB.position.z = -z;
      group.add(winB);
    }
  }

  // Side face windows (fewer)
  const sideCols = Math.max(1, Math.floor(cols * 0.4));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < sideCols; c++) {
      const z = -floorD / 2 + (floorD / (sideCols + 1)) * (c + 1);
      const y = -floorH / 2 + (floorH / (rows + 1)) * (r + 1);
      const x = floorW / 2 + winD / 2;

      const geo = new THREE.BoxGeometry(winD, winH, winW);
      const mat = new THREE.MeshBasicMaterial({ color });
      const win = new THREE.Mesh(geo, mat);
      win.position.set(x, y, z);
      win.userData.isWindow = true;
      group.add(win);

      const winL = win.clone();
      winL.position.x = -x;
      group.add(winL);
    }
  }

  return group;
}

// ─── Three.js building canvas ─────────────────────────────────────────────────
function BuildingCanvas({
  onFloorSelect, selectedFloor, isMobile,
}: {
  onFloorSelect: (id: number | null) => void;
  selectedFloor: number | null;
  isMobile: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendRef = useRef<any>(null);
  const camRef = useRef<any>(null);
  const meshesRef = useRef<any[]>([]);
  const groupRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const isVisRef = useRef(true);
  const hoveredRef = useRef<number | null>(null);
  const selectedRef = useRef<number | null>(selectedFloor);
  const rotYRef = useRef(0.4);
  const rotXRef = useRef(0.22);
  const autoRotRef = useRef(true);
  const isDragRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => { selectedRef.current = selectedFloor; }, [selectedFloor]);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled || !el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;

      // ── Scene setup ──────────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x060504);
      scene.fog = new THREE.Fog(0x060504, 18, 32);

      const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
      camera.position.set(isMobile ? 0 : -1.5, 9, 14);
      camera.lookAt(0, 1.5, 0);
      camRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: "high-performance" });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      renderer.shadowMap.enabled = !isMobile;
      el.appendChild(renderer.domElement);
      rendRef.current = renderer;

      // ── Lighting ─────────────────────────────────────────────────────────────
      const ambient = new THREE.AmbientLight(0x1a1408, 2.5);
      scene.add(ambient);

      const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
      sunLight.position.set(8, 14, 8);
      sunLight.castShadow = !isMobile;
      scene.add(sunLight);

      const fillLight = new THREE.DirectionalLight(0x0a0a1a, 0.8);
      fillLight.position.set(-6, 4, -6);
      scene.add(fillLight);

      // ── Ground plane ─────────────────────────────────────────────────────────
      const groundGeo = new THREE.PlaneGeometry(30, 30);
      const groundMat = new THREE.MeshLambertMaterial({ color: 0x0c0b08 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Ground grid lines
      for (let i = -5; i <= 5; i++) {
        const hGeo = new THREE.BoxGeometry(10, 0.005, 0.01);
        const hMat = new THREE.MeshBasicMaterial({ color: 0x1a1508, transparent: true, opacity: 0.6 });
        const hLine = new THREE.Mesh(hGeo, hMat);
        hLine.position.set(0, 0.001, i * 1);
        scene.add(hLine);

        const vLine = hLine.clone();
        vLine.rotation.y = Math.PI / 2;
        vLine.position.set(i * 1, 0.001, 0);
        scene.add(vLine);
      }

      // ── Building group ───────────────────────────────────────────────────────
      const buildingGroup = new THREE.Group();
      groupRef.current = buildingGroup;
      scene.add(buildingGroup);

      // Building dimensions per floor (bottom = wider, top = narrower = setback)
      const floorConfigs = [
        { w: 6.0, d: 4.0, h: 1.1 },  // Floor 1 — widest
        { w: 5.6, d: 3.7, h: 1.0 },  // Floor 2
        { w: 5.2, d: 3.4, h: 1.0 },  // Floor 3
        { w: 4.6, d: 3.0, h: 0.9 },  // Floor 4 — narrowest
      ];

      let cumulativeY = 0;

      FLOORS.forEach((f, i) => {
        const cfg = floorConfigs[i];
        const floorGroup = new THREE.Group();

        // ── Slab body ──
        const bodyGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(f.dimColor),
          roughness: 0.85,
          metalness: 0.15,
          envMapIntensity: 0.5,
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = !isMobile;
        body.receiveShadow = !isMobile;
        body.userData = {
          floorId: i,
          baseY: cumulativeY + cfg.h / 2,
          baseColor: f.dimColor,
          activeColor: f.color,
          bodyMat,
        };
        meshesRef.current[i] = body;
        floorGroup.add(body);

        // ── Edge wireframe ──
        const edges = new THREE.EdgesGeometry(bodyGeo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(f.color),
          transparent: true,
          opacity: 0.25,
        });
        const edgeLines = new THREE.LineSegments(edges, edgeMat);
        edgeLines.userData.isEdge = true;
        body.add(edgeLines);

        // ── Windows ──
        const winCols = i === 0 ? 8 : i === 1 ? 7 : i === 2 ? 6 : 5;
        const winRows = 2;
        const winColor = 0x1a1408; // dark by default
        const winGroup = createWindowGrid(THREE, cfg.w, cfg.h, cfg.d, winCols, winRows, winColor);
        winGroup.userData.isWindowGroup = true;
        body.add(winGroup);

        // ── Floor ledge (thin slab at top of each floor) ──
        const ledgeGeo = new THREE.BoxGeometry(cfg.w + 0.12, 0.06, cfg.d + 0.12);
        const ledgeMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1a1408"),
          roughness: 0.7,
          metalness: 0.3,
        });
        const ledge = new THREE.Mesh(ledgeGeo, ledgeMat);
        ledge.position.y = cfg.h / 2 + 0.03;
        ledge.castShadow = !isMobile;
        floorGroup.add(ledge);

        // ── Column pillars at corners ──
        const pillarPositions = [
          [-cfg.w / 2 + 0.08, cfg.d / 2 - 0.08],
          [cfg.w / 2 - 0.08, cfg.d / 2 - 0.08],
          [-cfg.w / 2 + 0.08, -cfg.d / 2 + 0.08],
          [cfg.w / 2 - 0.08, -cfg.d / 2 + 0.08],
        ];
        pillarPositions.forEach(([px, pz]) => {
          const pGeo = new THREE.CylinderGeometry(0.055, 0.055, cfg.h + 0.1, 6);
          const pMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#0f0d06"), roughness: 0.6, metalness: 0.4 });
          const pillar = new THREE.Mesh(pGeo, pMat);
          pillar.position.set(px, 0, pz);
          pillar.castShadow = !isMobile;
          body.add(pillar);
        });

        // ── Central atrium indent (front facade detail) ──
        if (i === 0) {
          const entranceGeo = new THREE.BoxGeometry(1.4, cfg.h * 0.7, 0.08);
          const entranceMat = new THREE.MeshBasicMaterial({ color: 0x080604 });
          const entrance = new THREE.Mesh(entranceGeo, entranceMat);
          entrance.position.set(0, -cfg.h * 0.15, cfg.d / 2 - 0.02);
          body.add(entrance);

          // Entrance frame
          const frameGeo = new THREE.BoxGeometry(1.5, cfg.h * 0.72, 0.04);
          const frameMat = new THREE.MeshBasicMaterial({ color: 0x3a2e10, transparent: true, opacity: 0.8 });
          const frame = new THREE.Mesh(frameGeo, frameMat);
          frame.position.set(0, -cfg.h * 0.15, cfg.d / 2 + 0.01);
          body.add(frame);
        }

        // ── Rooftop details on top floor ──
        if (i === FLOORS.length - 1) {
          // Central rooftop structure
          const roofGeo = new THREE.BoxGeometry(1.8, 0.5, 1.2);
          const roofMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#0e0c06"), roughness: 0.8, metalness: 0.2 });
          const roof = new THREE.Mesh(roofGeo, roofMat);
          roof.position.y = cfg.h / 2 + 0.28;
          floorGroup.add(roof);

          // Antenna / spire
          const spireGeo = new THREE.CylinderGeometry(0.02, 0.04, 1.2, 6);
          const spireMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#C9A84C"), roughness: 0.3, metalness: 0.8 });
          const spire = new THREE.Mesh(spireGeo, spireMat);
          spire.position.y = cfg.h / 2 + 0.5 + 0.6;
          floorGroup.add(spire);

          // Spire tip glow point light
          const spireLight = new THREE.PointLight(0xC9A84C, 0.8, 3);
          spireLight.position.y = cfg.h / 2 + 1.2;
          spireLight.userData.isSpireLight = true;
          floorGroup.add(spireLight);
        }

        floorGroup.position.y = cumulativeY + cfg.h / 2;
        buildingGroup.add(floorGroup);

        cumulativeY += cfg.h;
      });

      // Center building vertically
      const totalBuildingH = cumulativeY;
      buildingGroup.position.y = -totalBuildingH / 2 + 0.5;

      // ── Raycaster ────────────────────────────────────────────────────────────
      const raycaster = new THREE.Raycaster();
      const mouse2d = new THREE.Vector2(-9, -9);

      const getFloorId = (clientX: number, clientY: number): number | null => {
        const rect = el.getBoundingClientRect();
        mouse2d.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse2d.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse2d, camera);
        const hits = raycaster.intersectObjects(meshesRef.current, true);
        if (!hits.length) return null;
        let obj: any = hits[0].object;
        while (obj && obj.userData.floorId === undefined) obj = obj.parent;
        return typeof obj?.userData.floorId === "number" ? obj.userData.floorId : null;
      };

      // ── Input handlers ───────────────────────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        autoRotRef.current = false;
        if (isDragRef.current) {
          rotYRef.current += (e.clientX - lastPosRef.current.x) * 0.007;
          rotXRef.current += (e.clientY - lastPosRef.current.y) * 0.003;
          rotXRef.current = Math.max(-0.45, Math.min(0.55, rotXRef.current));
          lastPosRef.current = { x: e.clientX, y: e.clientY };
        }
        const fid = getFloorId(e.clientX, e.clientY);
        hoveredRef.current = fid;
        el.style.cursor = fid !== null ? "pointer" : "grab";
      };

      const onMouseDown = (e: MouseEvent) => {
        isDragRef.current = true;
        autoRotRef.current = false;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        el.style.cursor = "grabbing";
      };

      const onMouseUp = (e: MouseEvent) => {
        const dx = Math.abs(e.clientX - lastPosRef.current.x);
        if (isDragRef.current && dx < 5) {
          const fid = getFloorId(e.clientX, e.clientY);
          onFloorSelect(fid === selectedRef.current ? null : fid);
        }
        isDragRef.current = false;
        el.style.cursor = "grab";
        setTimeout(() => { autoRotRef.current = true; }, 3000);
      };

      const onMouseLeave = () => {
        isDragRef.current = false;
        hoveredRef.current = null;
        el.style.cursor = "grab";
        setTimeout(() => { autoRotRef.current = true; }, 1200);
      };

      let touchStartPos = { x: 0, y: 0 };
      const onTouchStart = (e: TouchEvent) => {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isDragRef.current = true;
        autoRotRef.current = false;
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!isDragRef.current) return;
        rotYRef.current += (e.touches[0].clientX - lastPosRef.current.x) * 0.006;
        rotXRef.current += (e.touches[0].clientY - lastPosRef.current.y) * 0.003;
        rotXRef.current = Math.max(-0.45, Math.min(0.55, rotXRef.current));
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTouchEnd = (e: TouchEvent) => {
        isDragRef.current = false;
        const dx = Math.abs(e.changedTouches[0].clientX - touchStartPos.x);
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartPos.y);
        if (dx < 8 && dy < 8) {
          const fid = getFloorId(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          onFloorSelect(fid === selectedRef.current ? null : fid);
        }
        setTimeout(() => { autoRotRef.current = true; }, 2500);
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: true });
      el.addEventListener("touchend", onTouchEnd);
      el.style.cursor = "grab";

      // ── Visibility observer — pause when off screen ───────────────────────
      const observer = new IntersectionObserver(
        ([e]) => { isVisRef.current = e.isIntersecting; },
        { threshold: 0.05 }
      );
      observer.observe(el);

      // ── Window glow colors ────────────────────────────────────────────────
      const windowDark = new THREE.Color(0x1a1408);
      const windowActive = new THREE.Color(0xfff0a0);
      const windowHover = new THREE.Color(0x8a6820);

      // ── Render loop ───────────────────────────────────────────────────────
      let frame = 0;
      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        if (!isVisRef.current) return;

        frame++;
        if (autoRotRef.current) rotYRef.current += 0.0025;

        buildingGroup.rotation.y = rotYRef.current;
        buildingGroup.rotation.x = rotXRef.current;

        const sel = selectedRef.current;
        const hov = hoveredRef.current;

        // Update floor appearance
        meshesRef.current.forEach((mesh: any, i: number) => {
          const { baseColor, activeColor, bodyMat } = mesh.userData;
          const isActive = sel === i;
          const isHov = hov === i && sel !== i;

          // Body color lerp
          const target = isActive ? activeColor : isHov ? "#5a4015" : baseColor;
          bodyMat.color.lerp(new THREE.Color(target), 0.07);

          // Lift active floor
          const floorGroup = buildingGroup.children[i] as any;
          const targetY = mesh.userData.baseY + (isActive ? 0.55 : 0);
          floorGroup.position.y += (targetY - floorGroup.position.y) * 0.1;

          // Edge opacity
          mesh.children.forEach((child: any) => {
            if (child.userData.isEdge) {
              const edgeMat = child.material as any;
              const targetOp = isActive ? 0.9 : isHov ? 0.55 : 0.2;
              edgeMat.opacity += (targetOp - edgeMat.opacity) * 0.1;
            }
            // Window glow
            if (child.userData.isWindowGroup) {
              child.children.forEach((win: any) => {
                const wMat = win.material as any;
                const tgt = isActive ? windowActive : isHov ? windowHover : windowDark;
                wMat.color.lerp(tgt, 0.08);
              });
            }
          });
        });

        // Spire pulse (every 60 frames)
        if (frame % 2 === 0) {
          const topGroup = buildingGroup.children[FLOORS.length - 1] as any;
          topGroup.children.forEach((child: any) => {
            if (child.userData.isSpireLight) {
              child.intensity = 0.5 + Math.sin(frame * 0.04) * 0.3;
            }
          });
        }

        renderer.render(scene, camera);
      };
      animate();

      // ── Resize ───────────────────────────────────────────────────────────
      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize, { passive: true });

      // ── Store cleanup ──────────────────────────────────────────────────────
      (el as any).__threeCleanup = () => {
        cancelAnimationFrame(rafRef.current);
        observer.disconnect();
        window.removeEventListener("resize", onResize);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
        renderer.dispose();
        meshesRef.current.forEach((m: any) => {
          m.material?.dispose();
          m.geometry?.dispose();
        });
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    });

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelled = true;
      if ((el as any)?.__threeCleanup) (el as any).__threeCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative" }} />;
}

// ─── Floor buttons ────────────────────────────────────────────────────────────
const FloorButtons = memo(function FloorButtons({
  selected, onSelect,
}: { selected: number | null; onSelect: (id: number | null) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {FLOORS.map(f => (
        <button key={f.id}
          onClick={() => onSelect(selected === f.id ? null : f.id)}
          style={{
            background: selected === f.id ? "rgba(201,168,76,0.1)" : "transparent",
            border: `1px solid ${selected === f.id ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
            color: selected === f.id ? "#C9A84C" : "rgba(255,255,255,0.42)",
            fontSize: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            padding: "5px 8px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
          <span style={{
            width: "4px", height: "4px", flexShrink: 0,
            background: selected === f.id ? "#C9A84C" : "rgba(201,168,76,0.28)",
            transition: "background 0.2s ease",
          }} />
          {f.label}
        </button>
      ))}
    </div>
  );
});

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MallMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<GsapInstance | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // headingVisible: shows text immediately when section enters viewport
  const [headingVisible, setHeadingVisible] = useState(false);
  // canvasReady: deferred — only true after user interaction or 3s idle
  const [canvasReady, setCanvasReady] = useState(false);

  // Phase 1: Show text/UI immediately on visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setIsMobile(window.innerWidth < 768);
        setHeadingVisible(true);
      },
      { rootMargin: "0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Phase 2: Load Three.js only after interaction OR 3s idle
  useEffect(() => {
    if (canvasReady) return;
    const wrap = canvasWrapRef.current;
    if (!wrap) return;

    const activate = () => {
      if (canvasReady) return;
      setCanvasReady(true);
      wrap.removeEventListener("mouseenter", activate);
      wrap.removeEventListener("touchstart", activate);
      clearTimeout(idleTimer);
    };

    // Idle fallback: load after 3 seconds if no interaction
    const idleTimer = setTimeout(activate, 3000);

    wrap.addEventListener("mouseenter", activate, { once: true });
    wrap.addEventListener("touchstart", activate, { once: true, passive: true });

    return () => {
      clearTimeout(idleTimer);
      wrap.removeEventListener("mouseenter", activate);
      wrap.removeEventListener("touchstart", activate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headingVisible]);

  const handleSelect = useCallback((id: number | null) => setSelected(id), []);

  return (
    <section
      id="mall-map"
      ref={sectionRef}
      style={{ background: "#050402", width: "100%", height: "100vh", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}
    >
      {/* Heading — compact on mobile, full on desktop */}
      <div
        className="map-heading"
        style={{
          textAlign: "center",
          padding: "clamp(0.6rem, 1.5vh, 1.4rem) 1rem clamp(0.3rem, 0.8vh, 0.7rem)",
          flexShrink: 0,
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <p style={{
          color: "#C9A84C", fontSize: "0.48rem", letterSpacing: "0.35em", textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 0.15rem"
        }}>
          Explore the property
        </p>
        <h2 style={{
          color: "#ffffff", fontSize: "clamp(0.95rem,2.4vw,1.8rem)", fontWeight: 800,
          fontFamily: "var(--font-montserrat)", margin: "0 0 0.15rem", lineHeight: 1.1
        }}>
          5.6 million sq ft{" "}
          <span style={{ color: "#C9A84C" }}>across 4 floors</span>
        </h2>
        <p className="map-subtitle" style={{
          color: "rgba(255,255,255,0.28)", fontSize: "0.56rem", fontFamily: "var(--font-montserrat)",
          fontWeight: 400, margin: "0 auto", maxWidth: "420px", lineHeight: 1.5
        }}>
          Rotate the building and click any floor to explore its retail mix, key tenants, and commercial opportunity.
        </p>
      </div>

      {/* Main body — fills remaining space */}
      <div
        ref={canvasWrapRef}
        className="map-canvas-wrap"
        style={{
          flex: 1, minHeight: 0,
          padding: "0 clamp(0.5rem,3vw,3rem)",
          opacity: headingVisible ? 1 : 0,
          transition: "opacity 1.1s ease 0.2s",
          position: "relative",
        }}
      >
        {/* ── DESKTOP grid: left sidebar | canvas | right panel ── */}
        <div className="map-inner-grid" style={{ height: "100%" }}>

          {/* Left — floor buttons (desktop sidebar) */}
          <div className="map-left-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.6rem" }}>
            <p style={{
              color: "rgba(255,255,255,0.2)", fontSize: "0.48rem", letterSpacing: "0.3em",
              textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 0.2rem"
            }}>
              Select floor
            </p>
            <FloorButtons selected={selected} onSelect={handleSelect} />
            <p style={{
              color: "rgba(255,255,255,0.15)", fontSize: "0.48rem", fontFamily: "var(--font-montserrat)",
              fontWeight: 400, margin: "0.2rem 0 0", lineHeight: 1.5, letterSpacing: "0.04em"
            }}>
              Drag to rotate.<br />Click floor to explore.
            </p>
          </div>

          {/* Centre — 3D building canvas */}
          <div style={{
            height: "100%", position: "relative",
            border: "1px solid rgba(201,168,76,0.08)", background: "#060504"
          }}>
            {/* CSS placeholder shown until Three.js is ready */}
            {!canvasReady && (
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "0.8rem",
                background: "#060504",
              }}>
                {/* Isometric stacked floors placeholder */}
                <svg width="160" height="180" viewBox="0 0 160 180" fill="none" style={{ opacity: 0.55 }}>
                  {FLOORS.map((f, i) => {
                    const yBase = 150 - i * 36;
                    const w = 110 - i * 10;
                    const h = 20;
                    const cx = 80;
                    return (
                      <g key={f.id}>
                        {/* Top face */}
                        <polygon
                          points={`${cx},${yBase - h} ${cx + w/2},${yBase - h/2} ${cx},${yBase} ${cx - w/2},${yBase - h/2}`}
                          fill={f.dimColor} stroke={f.color} strokeWidth="0.8" strokeOpacity="0.5"
                        />
                        {/* Right face */}
                        <polygon
                          points={`${cx + w/2},${yBase - h/2} ${cx + w/2},${yBase + h/2} ${cx},${yBase + h} ${cx},${yBase}`}
                          fill="rgba(0,0,0,0.4)" stroke={f.color} strokeWidth="0.8" strokeOpacity="0.3"
                        />
                        {/* Left face */}
                        <polygon
                          points={`${cx - w/2},${yBase - h/2} ${cx},${yBase} ${cx},${yBase + h} ${cx - w/2},${yBase + h/2}`}
                          fill="rgba(0,0,0,0.2)" stroke={f.color} strokeWidth="0.8" strokeOpacity="0.3"
                        />
                      </g>
                    );
                  })}
                  {/* Spire */}
                  <line x1="80" y1="2" x2="80" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="80" cy="2" r="3" fill="#C9A84C" opacity="0.8" />
                </svg>
                <p style={{
                  color: "rgba(201,168,76,0.4)", fontSize: "0.44rem",
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: 0,
                  animation: "mm-pulse 2s ease infinite",
                }}>Hover to explore 3D</p>
              </div>
            )}

            {canvasReady && (
              <BuildingCanvas
                onFloorSelect={handleSelect}
                selectedFloor={selected}
                isMobile={isMobile}
              />
            )}

            {/* ── MOBILE: horizontal floor pill bar overlaid at top of canvas ── */}
            <div className="map-mobile-floor-bar">
              {FLOORS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleSelect(selected === f.id ? null : f.id)}
                  style={{
                    background: selected === f.id ? "rgba(201,168,76,0.18)" : "rgba(6,5,4,0.72)",
                    border: `1px solid ${selected === f.id ? "#C9A84C" : "rgba(201,168,76,0.22)"}`,
                    color: selected === f.id ? "#C9A84C" : "rgba(255,255,255,0.5)",
                    fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
                    padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Corner decorations */}
            {(["tl", "tr", "bl", "br"] as const).map(pos => (
              <div key={pos} style={{
                position: "absolute", width: "10px", height: "10px",
                ...(pos.includes("t") ? { top: "7px" } : { bottom: "7px" }),
                ...(pos.includes("l") ? { left: "7px" } : { right: "7px" }),
                borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.35)" : "none",
                borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.35)" : "none",
                borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.35)" : "none",
                borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.35)" : "none",
                pointerEvents: "none",
              }} />
            ))}

            {/* Floor label overlay */}
            {selected !== null && (
              <div style={{
                position: "absolute", top: "0.8rem", left: "50%",
                transform: "translateX(-50%)",
                color: "#C9A84C", fontSize: "0.58rem", letterSpacing: "0.3em",
                textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
                fontWeight: 700, pointerEvents: "none", whiteSpace: "nowrap",
                background: "rgba(6,5,4,0.7)", padding: "4px 12px",
                border: "1px solid rgba(201,168,76,0.2)",
              }}>
                {FLOORS[selected].name}
              </div>
            )}

            {selected === null && (
              <div style={{
                position: "absolute", bottom: "0.8rem", left: "50%", transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.18)", fontSize: "0.56rem", letterSpacing: "0.22em",
                textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 500,
                pointerEvents: "none", whiteSpace: "nowrap",
              }}>
                Drag · Click a floor
              </div>
            )}

            {/* ── MOBILE: bottom sheet info panel ── */}
            <div
              className="map-mobile-sheet"
              style={{
                transform: selected !== null ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {selected !== null && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div>
                      <div style={{ color: "rgba(201,168,76,0.6)", fontSize: "0.42rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 700 }}>
                        {FLOORS[selected].label}
                      </div>
                      <div style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1.1 }}>
                        {FLOORS[selected].name}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelect(null)}
                      style={{
                        background: "transparent", border: "1px solid rgba(201,168,76,0.25)",
                        color: "rgba(201,168,76,0.6)", width: "22px", height: "22px",
                        fontSize: "0.7rem", cursor: "pointer", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >✕</button>
                  </div>
                  <div style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.5rem", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginBottom: "0.4rem" }}>
                    {FLOORS[selected].stat}
                  </div>
                  {/* Mini zone bars */}
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                    {FLOORS[selected].zones.map(z => (
                      <div key={z.label} style={{ flex: z.pct, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.2)", padding: "3px 4px", textAlign: "center" }}>
                        <div style={{ color: "#C9A84C", fontSize: "0.5rem", fontWeight: 700, fontFamily: "var(--font-montserrat)" }}>{z.pct}%</div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.38rem", letterSpacing: "0.05em", fontFamily: "var(--font-montserrat)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{z.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Tenant pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem" }}>
                    {FLOORS[selected].tenants.map(t => (
                      <span key={t} style={{
                        background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)",
                        color: "rgba(255,255,255,0.6)", fontSize: "0.44rem",
                        fontFamily: "var(--font-montserrat)", fontWeight: 500,
                        letterSpacing: "0.05em", padding: "2px 6px",
                      }}>{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right — info panel (desktop only) */}
          <div className="map-right-col" style={{ borderLeft: "1px solid rgba(201,168,76,0.08)", paddingLeft: "0.75rem", minHeight: 0, overflow: "hidden" }}>
            <SidePanel floor={selected !== null ? FLOORS[selected] : null} visible={true} />
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div style={{
        flexShrink: 0, height: "1px",
        background: "linear-gradient(to right,transparent,rgba(201,168,76,0.12),transparent)"
      }} />

      <style>{`
        /* ── Placeholder pulse ── */
        @keyframes mm-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }

        /* ── Desktop grid: sidebar | canvas | info ── */
        .map-inner-grid {
          display: grid;
          grid-template-columns: 100px 1fr clamp(160px, 18vw, 240px);
          gap: 0;
          height: 100%;
        }
        @media (min-width: 1024px) {
          .map-inner-grid {
            grid-template-columns: 110px 1fr clamp(190px, 20vw, 280px);
          }
        }

        /* ── Mobile overrides (≤ 767px) ── */
        @media (max-width: 767px) {
          /* Hide the long subtitle on mobile to reclaim vertical space */
          .map-subtitle { display: none !important; }

          /* Remove side padding so canvas fills edge-to-edge */
          .map-canvas-wrap { padding: 0 !important; }

          /* Single column — only the canvas cell spans the full area */
          .map-inner-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: 1fr !important;
            gap: 0 !important;
          }

          /* Hide the desktop left sidebar and right info column */
          .map-left-col  { display: none !important; }
          .map-right-col { display: none !important; }

          /* Canvas div fills all remaining height */
          .map-inner-grid > div:nth-child(2) {
            grid-column: 1 !important;
            grid-row: 1 !important;
            min-height: 0 !important;
          }
        }

        /* ── Mobile floor pill bar (overlaid at top of canvas) ── */
        .map-mobile-floor-bar {
          display: none;
        }
        @media (max-width: 767px) {
          .map-mobile-floor-bar {
            display: flex;
            position: absolute;
            top: 0.6rem;
            left: 50%;
            transform: translateX(-50%);
            gap: 0.3rem;
            z-index: 10;
            padding: 0 0.5rem;
            pointer-events: auto;
            max-width: calc(100% - 1rem);
            overflow-x: auto;
          }
        }

        /* ── Mobile bottom-sheet info panel ── */
        .map-mobile-sheet {
          display: none;
        }
        @media (max-width: 767px) {
          .map-mobile-sheet {
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 20;
            background: rgba(6, 5, 4, 0.93);
            border-top: 1px solid rgba(201,168,76,0.22);
            backdrop-filter: blur(14px);
            padding: 0.75rem 1rem 1rem;
            max-height: 42%;
            overflow-y: auto;
          }
        }
      `}</style>
    </section>
  );
}