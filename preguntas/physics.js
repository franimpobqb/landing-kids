import { state } from './state.js';
import * as C from './config.js';
import { emitWakeParticle, emitBowParticle } from './graphics.js'; // Import new functions

export function updatePhysics(dt) {
    let desiredMove = 0;
    let desiredRot = 0;
    
    // Check analog input first
    if (state.analogMove !== 0) {
        desiredMove = state.analogMove < 0 
            ? state.analogMove * C.MAX_FORWARD_SPEED
            : state.analogMove * C.MAX_REVERSE_SPEED;
    }
    if (state.analogRot !== 0) {
        desiredRot = state.analogRot * C.TURN_RATE;
    }

    // Keyboard controls as fallback
    if (desiredMove === 0) {
        if (state.keys["w"] || state.keys["arrowup"]) desiredMove = -C.MAX_FORWARD_SPEED;
        if (state.keys["s"] || state.keys["arrowdown"]) desiredMove = C.MAX_REVERSE_SPEED;
    }
    if (desiredRot === 0) {
        if (state.keys["a"] || state.keys["arrowleft"]) desiredRot = C.TURN_RATE;
        if (state.keys["d"] || state.keys["arrowright"]) desiredRot = -C.TURN_RATE;
    }

    // Apply acceleration/decay
    if (desiredMove !== 0) {
        state.moveForce += (desiredMove - state.moveForce) * C.ACCELERATION_RATE;
    } else {
        state.moveForce *= Math.pow(C.DECAY_RATE, dt * 60);
    }
    if (desiredRot !== 0) {
        state.rotForce += (desiredRot - state.rotForce) * C.ACCELERATION_RATE;
    } else {
        state.rotForce *= Math.pow(C.DECAY_RATE, dt * 60);
    }

    if (Math.abs(state.moveForce) < 0.001) state.moveForce = 0;
    if (Math.abs(state.rotForce) < 0.001) state.rotForce = 0;

    // Apply forces to ferry
    state.ferry.rotation.y += state.rotForce;
    state.ferry.translateZ(state.moveForce * dt * 60);
    state.ferry.position.y = 0.6 + Math.sin(performance.now() * 0.0035) * 0.08; // Bobbing

    // Emit particles if moving forward
    if (state.moveForce < -0.05) { // Only emit when moving forward substantially
        const speedRatio = Math.abs(state.moveForce) / C.MAX_FORWARD_SPEED;
        
        // Stern Wake Emission
        const sternEmitRate = C.WAKE_MIN_EMIT + (C.WAKE_MAX_EMIT - C.WAKE_MIN_EMIT) * speedRatio;
        state.sternEmitTimer += dt;
        if (state.sternEmitTimer > 1 / sternEmitRate) {
            emitWakeParticle(speedRatio);
            state.sternEmitTimer = 0;
        }
        
        // Bow Splash Emission
        const bowEmitRate = C.BOW_MIN_EMIT + (C.BOW_MAX_EMIT - C.BOW_MIN_EMIT) * speedRatio;
        state.bowEmitTimer += dt;
        if (state.bowEmitTimer > 1 / bowEmitRate) {
            emitBowParticle(speedRatio);
            state.bowEmitTimer = 0;
        }
    }
}