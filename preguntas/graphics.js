import * as THREE from 'three';
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { state } from './state.js';
import * as C from './config.js'; // C for Config

// ----- SETUP FUNCTIONS -----

export function createScene() {
    state.scene = new THREE.Scene();
    state.scene.fog = new THREE.Fog(0x87ceeb, 500, 10000);

    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
    state.renderer.setSize(window.innerWidth, window.innerHeight);

    state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    state.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    state.scene.add(dirLight);
}

// ----- UPDATED: createFerry (ExtrudeGeometry) -----
export function createFerry() {
    state.ferry = new THREE.Object3D();

    // Define materials
    const hullMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.2, 
        roughness: 0.8 
    });
    const superstructureMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, // This is what you will apply your texture to
        metalness: 0.2, 
        roughness: 0.8 
    });
    const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222, // Dark block for windows
        metalness: 0.1, 
        roughness: 0.5 
    });

    // --- 1. Hulls and Platform (Same as before) ---
    const HULL_LENGTH = C.SHIP_LENGTH; // 70
    const HULL_WIDTH = C.SHIP_WIDTH / 3; // ~8.3
    const HULL_HEIGHT = C.SHIP_HEIGHT * 0.7; // 10.5
    const HULL_SEPARATION = C.SHIP_WIDTH * 0.8; // 20
    const platWidth = HULL_SEPARATION + HULL_WIDTH; // ~28.3
    const platHeight = 2;
    const platBaseY = HULL_HEIGHT + platHeight / 2;

    const hullGeom = new THREE.BoxGeometry(HULL_WIDTH, HULL_HEIGHT, HULL_LENGTH);
    const hullLeft = new THREE.Mesh(hullGeom, hullMaterial);
    hullLeft.position.set(-HULL_SEPARATION / 2, HULL_HEIGHT / 2, 0);
    state.ferry.add(hullLeft);

    const hullRight = new THREE.Mesh(hullGeom, hullMaterial);
    hullRight.position.set(HULL_SEPARATION / 2, HULL_HEIGHT / 2, 0);
    state.ferry.add(hullRight);

    const platGeom = new THREE.BoxGeometry(platWidth, platHeight, HULL_LENGTH);
    const platform = new THREE.Mesh(platGeom, hullMaterial); // Use hull material
    platform.position.y = platBaseY;
    state.ferry.add(platform);

    // --- 2. Main Superstructure (Level 1) ---
    const s1Height = C.SHIP_HEIGHT * 0.6; // 9
    const s1Length = HULL_LENGTH * 0.85; // ~59.5
    const s1Width = platWidth * 0.95; // ~26.9
    const s1BaseY = platBaseY + platHeight / 2;

    // Define the side-profile shape
    const s1Shape = new THREE.Shape();
    const frontAngleCut = s1Length * 0.2;
    const backAngleCut = s1Length * 0.1;

    // Start at bottom-back corner (z+, y)
    s1Shape.moveTo(s1Length / 2, s1BaseY);
    // Line to top-back (angled)
    s1Shape.lineTo(s1Length / 2 - backAngleCut, s1BaseY + s1Height);
    // Line to top-front (angled)
    s1Shape.lineTo(-s1Length / 2 + frontAngleCut, s1BaseY + s1Height);
    // Line to bottom-front
    s1Shape.lineTo(-s1Length / 2, s1BaseY);
    // Close the shape
    s1Shape.closePath();

    const extrudeSettings = {
        steps: 1,
        depth: s1Width,
        bevelEnabled: false,
    };

    const s1Geom = new THREE.ExtrudeGeometry(s1Shape, extrudeSettings);
    const s1 = new THREE.Mesh(s1Geom, superstructureMaterial);
    // Adjust position because extrusion happens from center
    s1.position.x = -s1Width / 2;
    // Set back from the main front
    s1.position.z = (HULL_LENGTH - s1Length) / 2 - HULL_LENGTH * 0.1;
    s1.rotation.y = Math.PI / 2; // Rotate to face forward
    state.ferry.add(s1);

    // --- 3. Bridge (Level 2) ---
    const s2Height = C.SHIP_HEIGHT * 0.35; // 5.25
    const s2Length = HULL_LENGTH * 0.3; // 21
    const s2Width = s1Width * 0.9; // ~24.2
    const s2BaseY = s1BaseY + s1Height; // Sits on top of s1

    const s2Shape = new THREE.Shape();
    const s2FrontAngle = s2Length * 0.2;
    const s2BackAngle = s2Length * 0.1;

    s2Shape.moveTo(s2Length / 2, s2BaseY);
    s2Shape.lineTo(s2Length / 2 - s2BackAngle, s2BaseY + s2Height);
    s2Shape.lineTo(-s2Length / 2 + s2FrontAngle, s2BaseY + s2Height);
    s2Shape.lineTo(-s2Length / 2, s2BaseY);
    s2Shape.closePath();

    const s2ExtrudeSettings = {
        steps: 1,
        depth: s2Width,
        bevelEnabled: false,
    };

    const s2Geom = new THREE.ExtrudeGeometry(s2Shape, s2ExtrudeSettings);
    const s2 = new THREE.Mesh(s2Geom, superstructureMaterial);
    s2.position.x = -s2Width / 2;
    s2.position.z = -HULL_LENGTH / 2 + s2Length / 2 + HULL_LENGTH * 0.05;
    s2.rotation.y = Math.PI / 2;
    state.ferry.add(s2);

    // --- 4. Bridge Windows (Simple Box) ---
    const winHeight = s2Height * 0.6;
    const winWidth = s2Width + 0.1; // Slightly wider
    const winLength = s2Length * 0.2; // Thinner
    
    const winGeom = new THREE.BoxGeometry(winWidth, winHeight, winLength);
    const win = new THREE.Mesh(winGeom, windowMaterial);
    win.position.set(
        0,
        s2BaseY + s2Height * 0.5,
        s2.position.z - (s2Length / 2) + (winLength / 2) + (s2FrontAngle * 0.8) // Pushed back
    );
    // Angle the window box to match the bridge's front
    win.rotation.x = -Math.atan((s2Height) / (s2FrontAngle));
    state.ferry.add(win);


    // Add the completed ferry to the scene
    state.ferry.position.set(0, 0, 50);
    state.scene.add(state.ferry);
}


export function createWater() {
    const waterGeo = new THREE.PlaneGeometry(10000, 10000);
    state.water = new Water(waterGeo, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: new THREE.TextureLoader().load(
            "https://threejs.org/examples/textures/waternormals.jpg",
            (tx) => { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x1ca3ec,
        distortionScale: 3.0,
        fog: state.scene.fog !== undefined,
    });
    state.water.rotation.x = -Math.PI / 2;
    state.scene.add(state.water);
}

export function createSky() {
    state.sky = new Sky();
    state.sky.scale.setScalar(10000);
    state.scene.add(state.sky);

    const sunParams = { elevation: 15, azimuth: 180 };

    const phi = THREE.MathUtils.degToRad(90 - sunParams.elevation);
    const theta = THREE.MathUtils.degToRad(sunParams.azimuth);
    state.sunVec.setFromSphericalCoords(1, phi, theta);
    
    const skyUniforms = state.sky.material.uniforms;
    skyUniforms["sunPosition"].value.copy(state.sunVec);
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 3.5;
    skyUniforms["mieCoefficient"].value = 0.008;
    skyUniforms["mieDirectionalG"].value = 0.3;

    state.water.material.uniforms["sunDirection"].value.copy(state.sunVec).normalize();
    
    const dirLight = state.scene.children.find(o => o.isDirectionalLight);
    if(dirLight) dirLight.position.copy(state.sunVec).multiplyScalar(10000);
}

export async function createCheckpoints() {
    const response = await fetch('./questions.json');
    const ALL_QUESTIONS = await response.json();
    const shuffledQuestions = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());

    const cpPositions = [];
    const gridDim = Math.sqrt(C.NUM_CHECKPOINTS);
    const totalArea = C.SCATTER_RADIUS * 2;
    const cellSize = totalArea / gridDim;

    let index = 0;
    for (let i = 0; i < gridDim; i++) {
        for (let j = 0; j < gridDim; j++) {
            const cellCenterX = -C.SCATTER_RADIUS + (i * cellSize) + (cellSize / 2);
            const cellCenterZ = -C.SCATTER_RADIUS + (j * cellSize) + (cellSize / 2);

            const jitterX = (Math.random() - 0.5) * cellSize;
            const jitterZ = (Math.random() - 0.5) * cellSize;

            let x = cellCenterX + jitterX;
            let z = cellCenterZ + jitterZ;
            
            if (Math.abs(x) < C.SHIP_WIDTH * 2 && Math.abs(z) < C.SHIP_WIDTH * 2) {
                x += C.SHIP_WIDTH * 2;
                z -= C.SHIP_WIDTH * 2;
            }

            cpPositions.push(new THREE.Vector3(x, 1.5, z));
            index++;
        }
    }

    cpPositions.forEach((pos, idx) => {
        const geo = new THREE.TorusGeometry(8, 0.8, 16, 60);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 0.8,
            metalness: 0.1, roughness: 0.6, transparent: true, opacity: 0.95,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.copy(pos);
        state.scene.add(mesh);

        const question = shuffledQuestions[idx]; 
        let iconSprite = null;

        if (question.category && C.CATEGORY_ICONS[question.category]) {
            const iconUrl = C.CATEGORY_ICONS[question.category];
            const iconTexture = new THREE.TextureLoader().load(iconUrl);
            const iconMaterial = new THREE.SpriteMaterial({ map: iconTexture, transparent: true });
            iconSprite = new THREE.Sprite(iconMaterial);
            iconSprite.scale.set(12, 12, 1);
            iconSprite.position.copy(mesh.position).add(new THREE.Vector3(0, 22, 0));
            state.scene.add(iconSprite);
        }

        state.checkpointObjs.push({
            id: idx, mesh, icon: iconSprite, baseY: pos.y, question: question, reached: false,
        });
    });
}

export function createParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.7,
    });
    for (let i = 0; i < C.MAX_PARTICLES; i++) {
        const p = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        p.visible = false;
        p.userData.life = 0;
        p.userData.speed = new THREE.Vector3();
        p.userData.gravity = 0;
        state.scene.add(p);
        state.allParticles.push(p);
    }
}

// ----- UPDATE FUNCTIONS -----

export function updateGraphics(t, dt) {
    if (state.water.material.uniforms.time)
        state.water.material.uniforms.time.value += dt;

    state.allParticles.forEach((p) => {
        if (p.visible) {
            p.userData.life -= dt;
            if (p.userData.life <= 0 || p.position.y < -1) {
                p.visible = false;
            } else {
                if (p.userData.gravity !== 0) {
                    p.userData.speed.y += p.userData.gravity * dt;
                }
                p.position.addScaledVector(p.userData.speed, dt);
                const lifeRatio = p.userData.life / C.PARTICLE_LIFETIME;
                p.material.opacity = lifeRatio * 0.9;
                p.scale.setScalar(lifeRatio);
            }
        }
    });

    state.checkpointObjs.forEach((cp) => {
        if (cp.reached) return;
        cp.mesh.rotation.z += dt * 0.8;
        cp.mesh.position.y = cp.baseY + Math.sin(t * 2 + cp.id) * 1.0;
        if (cp.icon) {
            cp.icon.position.y = cp.mesh.position.y + 22;
        }
    });

    const offset = state.cameraOffset.clone().applyQuaternion(state.ferry.quaternion);
    const targetCameraPos = state.ferry.position.clone().add(offset);
    state.camera.position.lerp(targetCameraPos, state.smoothing);
    state.camera.lookAt(state.ferry.position.clone().add(new THREE.Vector3(0, 4, 0)));
}

// ----- PARTICLE EMITTERS (Called by Physics) -----

export function emitWakeParticle(speedRatio) {
    const p = state.allParticles[state.particleIndex];
    state.particleIndex = (state.particleIndex + 1) % C.MAX_PARTICLES;
    const currentSpread = C.SHIP_WIDTH * (C.WAKE_MIN_SPREAD + (C.WAKE_MAX_SPREAD - C.WAKE_MIN_SPREAD) * speedRatio);
    const offset = new THREE.Vector3((Math.random() - 0.5) * currentSpread, -1, C.SHIP_LENGTH / 2 + 2);
    offset.applyQuaternion(state.ferry.quaternion);
    p.position.copy(state.ferry.position).add(offset);
    
    const sideVel = (0.5 + speedRatio * 1.5) * (Math.random() - 0.5);
    const backVel = 1.0 + speedRatio * 1.5 + Math.random();
    const speed = new THREE.Vector3(sideVel, 0, backVel);
    speed.applyQuaternion(state.ferry.quaternion);
    
    p.userData.speed.copy(speed);
    p.userData.life = C.PARTICLE_LIFETIME * (1 + speedRatio * 0.5);
    p.material.opacity = 0.5 + speedRatio * 0.3;
    p.userData.gravity = 0;
    p.scale.set(1, 1, 1);
    p.visible = true;
}

export function emitBowParticle(speedRatio) {
    const p = state.allParticles[state.particleIndex];
    state.particleIndex = (state.particleIndex + 1) % C.MAX_PARTICLES;
    
    const side = Math.sign(Math.random() - 0.5);
    const offset = new THREE.Vector3(side * (C.SHIP_WIDTH / 2), 0, -C.SHIP_LENGTH / 2);
    offset.applyQuaternion(state.ferry.quaternion);
    p.position.copy(state.ferry.position).add(offset);
    
    const sideVel = side * (1.0 + speedRatio * 2.0);
    const upVel = 2.0 + speedRatio * 4.0;
    const backVel = -(1.0 + speedRatio);
    const speed = new THREE.Vector3(sideVel, upVel, backVel);
    speed.applyQuaternion(state.ferry.quaternion);
    
    p.userData.speed.copy(speed);
    p.userData.life = C.PARTICLE_LIFETIME * (0.5 + speedRatio * 0.5);
    p.material.opacity = 0.8 + speedRatio * 0.2;
    p.userData.gravity = -9.8;
    p.scale.set(1, 1, 1);
    p.visible = true;
}