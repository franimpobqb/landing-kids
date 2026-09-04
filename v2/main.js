import * as THREE from 'three';
import { state } from './state.js';
import { createScene, createFerry, createWater, createSky, createCheckpoints, createParticles, updateGraphics } from './graphics.js';
import { setupControls } from './controls.js';
// NEW: Import timer functions
import { setupUI, updateTimerDisplay, showFinalModal } from './ui.js';
import { updatePhysics } from './physics.js';
import { updateGameLogic } from './gameLogic.js';

// 1. Initialization
async function init() {
    createScene();
    createFerry();
    createWater();
    createSky();
    // We MUST 'await' the async function
    await createCheckpoints(); 
    createParticles();
    setupControls();
    setupUI();

    const offset = state.cameraOffset.clone().applyQuaternion(state.ferry.quaternion).add(state.ferry.position);
    state.camera.position.copy(offset);
    state.camera.lookAt(state.ferry.position);

    document.body.appendChild(state.renderer.domElement);

    window.addEventListener("resize", () => {
        state.camera.aspect = innerWidth / innerHeight;
        state.camera.updateProjectionMatrix();
        state.renderer.setSize(innerWidth, innerHeight);
        if (state.updateJoystickDimensions) {
            state.updateJoystickDimensions();
        }
    });

    animate();
}
// 2. Main Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    // NEW: Timer and game-end logic
    // This block runs as long as the game isn't paused (by intro or question)
    if (!state.gamePaused && state.timerValue > 0) {
        state.timerValue -= dt;

        if (state.timerValue < 0) {
            state.timerValue = 0;
        }

        updateTimerDisplay(); // Update the 02:00 text

        if (state.timerValue === 0) {
            showFinalModal(); // Show the end-game popup
        }
    }

    // Physics and Game Logic only run if game is not paused
    if (!state.gamePaused) {
        updatePhysics(dt);
        updateGameLogic();
    }
    
    // Graphics always update (so camera can move, particles animate, etc.)
    updateGraphics(t, dt);

    state.renderer.render(state.scene, state.camera);
}

init();