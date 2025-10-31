import * as THREE from 'three';
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { state } from './state.js';
import * as C from './config.js'; // C for Config

const textureLoader = new THREE.TextureLoader();

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

// ----- "LIGHT" createFerry -----
// NOW INCLUDES ANISOTROPY FIX FOR BLURRINESS

export function createFerry() {
   	state.ferry = new THREE.Object3D();
 
   	// --- NEW: Get the max anisotropy level from the renderer ---
   	// We must do this *after* the renderer is created in createScene()
 	const maxAnisotropy = state.renderer.capabilities.getMaxAnisotropy();


   	// --- Load Textures (NOW WITH ANISOTROPY) ---
   	const leftTexture = textureLoader.load('images/ferry_left.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const rightTexture = textureLoader.load('images/ferry_right.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const frontTexture = textureLoader.load('images/ferry_front.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const backTexture = textureLoader.load('images/ferry_back.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const topTexture = textureLoader.load('images/ferry_top.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const cabinBackTexture = textureLoader.load('images/cabin_back.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
 
   	// --- NEW: Add just two new textures for the cabin ---
   	const cabinFrontTexture = textureLoader.load('images/cabin_front.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});
   	const cabinTopTexture = textureLoader.load('images/cabin_top.png', (tx) => {
     	 	tx.anisotropy = maxAnisotropy;
   	});


   	// --- Materials ---
   	const sideMaterialOptions = {
       	metalness: 0.1,
       	roughness: 0.9,
       	transparent: true
   	};

   	const leftMaterial = new THREE.MeshStandardMaterial({ map: leftTexture, ...sideMaterialOptions });
   	const rightMaterial = new THREE.MeshStandardMaterial({ map: rightTexture, ...sideMaterialOptions });
   	const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture, ...sideMaterialOptions });
   	const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture, ...sideMaterialOptions });
   	const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture, ...sideMaterialOptions });
   	const cabinBackMaterial = new THREE.MeshStandardMaterial({ map: cabinBackTexture, ...sideMaterialOptions });
   	const cabinFrontMaterial = new THREE.MeshStandardMaterial({ map: cabinFrontTexture, ...sideMaterialOptions });
   	const cabinTopMaterial = new THREE.MeshStandardMaterial({ map: cabinTopTexture, ...sideMaterialOptions });

   	// --- Fallback/base materials ---
   	const bottomMaterial = new THREE.MeshStandardMaterial({
       	color: 0xcccccc,
       	metalness: 0.2,
       	roughness: 0.8
   	});
   	const deckAntennaMaterial = new THREE.MeshStandardMaterial({
       	color: 0x666666,
       	metalness: 0.4,
       	roughness: 0.6
   	});

   	// --- Hull Dimensions ---
   	const hullLength = C.SHIP_LENGTH; // 100
   	const hullWidth = C.SHIP_WIDTH;   // 25
   	const hullHeight = C.SHIP_HEIGHT; // 15
   	const cabinHeight = C.SUPERSTRUCTURE_HEIGHT; // 4

   	// --- 1. Main Hull (Unchanged) ---
   	const hullGeom = new THREE.BoxGeometry(hullWidth, hullHeight, hullLength);
   	const hullMaterials = [
     	   	rightMaterial,  // 0: right
     	   	leftMaterial,   // 1: left
     	   	topMaterial,    // 2: top
     	   	bottomMaterial, // 3: bottom
     	   	backMaterial,   // 4: back
     	   	frontMaterial   // 5: front
   	];
   	const hullMesh = new THREE.Mesh(hullGeom, hullMaterials);
   	hullMesh.position.y = hullHeight / 2;
   	state.ferry.add(hullMesh);

   	// --- 2. Cabin (Simple Box on Top) ---
   	const cabinWidth = hullWidth;
   	const cabinLength = hullLength * 0.3; // 30
   	const cabinGeom = new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinLength);

   	// --- UPDATED CABIN MATERIALS ---
   	const cabinMaterials = [
     	   	rightMaterial,      // 0: right (Still re-used, distortion is minor)
     	   	leftMaterial,       // 1: left (Still re-used, distortion is minor)
     	   	cabinTopMaterial,   // 2: top <-- FIXED
     	   	bottomMaterial,     // 3: bottom (Covered)
     	   	cabinBackMaterial,  // 4: back (Specific)
     	   	cabinFrontMaterial  // 5: front <-- FIXED
   	];
   	const cabinMesh = new THREE.Mesh(cabinGeom, cabinMaterials);
   	cabinMesh.position.y = hullHeight + cabinHeight / 2;
   	cabinMesh.position.z = -hullLength / 2 + cabinLength / 2 + hullLength * 0.05;
   	state.ferry.add(cabinMesh);
 
   	// --- 3. Front Deck Surface ---
   	const deckHeight = 2;
   	const deckWidth = hullWidth;
   	const deckLength = hullLength * 0.4;
   	const deckGeom = new THREE.BoxGeometry(deckWidth, deckHeight, deckLength);

   	const deckTopMaterial = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.3, roughness: 0.7 });
   	const deckSideMaterial = deckAntennaMaterial;
   	const deckBackMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.8 }); // White face against cabin

   	const deckMaterials = [
     	   	deckSideMaterial,  // 0: right
     	   	deckSideMaterial,  // 1: left
     	   	deckTopMaterial,   // 2: top
     	   	bottomMaterial,   	// 3: bottom
     	   	deckBackMaterial,  // 4: back
     	   	deckSideMaterial   // 5: front
   	];

   	const deckMesh = new THREE.Mesh(deckGeom, deckMaterials);

   	deckMesh.position.y = hullHeight + deckHeight / 2;
   	deckMesh.position.z = -hullLength / 2 + deckLength / 2;
   	state.ferry.add(deckMesh);

   	// --- 4. Small Antenna ---
   	const antennaRadius = 0.5;
   	const antennaHeight = 10;
   	const antennaSegments = 8;
   	const antennaGeom = new THREE.CylinderGeometry(antennaRadius, antennaRadius, antennaHeight, antennaSegments);
   	const antennaMesh = new THREE.Mesh(antennaGeom, deckAntennaMaterial);

   	antennaMesh.position.y = hullHeight + deckHeight + antennaHeight / 2;
   	antennaMesh.position.z = -hullLength / 2 + deckLength * 0.2;
   	antennaMesh.position.x = 0;
   	state.ferry.add(antennaMesh);

   	// --- Final Positioning ---
   	state.ferry.position.set(0, 0, 50);
   	state.scene.add(state.ferry);
}

// ----- UNCHANGED FUNCTIONS -----

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
   	 	   	p.scale.setScalar(lifeRatio); // Simple scale fade
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

   	if (state.ferry) { // Check if ferry exists
       	const offset = state.cameraOffset.clone().applyQuaternion(state.ferry.quaternion);
       	const targetCameraPos = state.ferry.position.clone().add(offset);
       	state.camera.position.lerp(targetCameraPos, state.smoothing);
     	   	state.camera.lookAt(state.ferry.position.clone().add(new THREE.Vector3(0, 4, 0)));
   	}
}


// ----- PARTICLE EMITTERS -----
export function emitWakeParticle(speedRatio) {
   	 if (!state.ferry) return; // Guard

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
   	 if (!state.ferry) return; // Guard

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