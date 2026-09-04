import * as THREE from 'three';

export const state = {
    // Graphics
    scene: null,
    renderer: null,
    camera: null,
    ferry: null,
    water: null,
    sky: null,
    sunVec: new THREE.Vector3(),
    radarMesh: null,
    cameraOffset: new THREE.Vector3(0, 32, 75),
    smoothing: 0.06,

    // Particles
    allParticles: [],
    particleIndex: 0,
    sternEmitTimer: 0,
    bowEmitTimer: 0,
    
    // Logic
    checkpointObjs: [],
    score: 0,
    gamePaused: true, // Start paused for intro modal
    scoreEl: null,
    showQuestionModal: null, // Will be set by ui.js
    
    // Timer
    timerValue: 120, // <-- THIS IS THE FIX. Make sure this line is exactly right.
    timerEl: null,

    // Physics
    moveForce: 0,
    rotForce: 0,

    // Controls
    keys: {},
    analogMove: 0,
    analogRot: 0,
    updateJoystickDimensions: null // Will be set by controls.js
};