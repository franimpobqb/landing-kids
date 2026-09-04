import { state } from './state.js';

export function setupControls() {
    // Keyboard listeners
    addEventListener("keydown", (e) => (state.keys[e.key.toLowerCase()] = true));
    addEventListener("keyup", (e) => (state.keys[e.key.toLowerCase()] = false));

    // Joystick listeners
    const joystickArea = document.getElementById("joystick-area");
    const joystickHandle = document.getElementById("joystick-handle");
    
    let joystickRadius = 0;
    let handleRadius = 0;
    let maxStickTravel = 0;
    
    let activeTouchId = null;
    let stickStartX = 0;
    let stickStartY = 0;

    function updateJoystickDimensions() {
        joystickRadius = joystickArea.clientWidth / 2;
        handleRadius = joystickHandle.clientWidth / 2;
        maxStickTravel = joystickRadius - handleRadius;
    }
    
    state.updateJoystickDimensions = updateJoystickDimensions; // Share with main.js
    updateJoystickDimensions();

    function getTouch(e) {
        if (activeTouchId !== null && e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === activeTouchId) return e.touches[i];
            }
        }
        if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0];
        if (e.touches && e.touches.length > 0) return e.touches[0];
        return e; // For mouse events
    }

    function onStickStart(e) {
        if (activeTouchId !== null) return;
        if (e.preventDefault) e.preventDefault();
        
        const touch = getTouch(e);
        activeTouchId = touch.identifier ?? 'mouse';
        
        const rect = joystickArea.getBoundingClientRect();
        stickStartX = rect.left + joystickRadius;
        stickStartY = rect.top + joystickRadius;
        
        onStickMove(e);
    }

    function onStickMove(e) {
        if (activeTouchId === null) return;
        if (e.preventDefault) e.preventDefault();

        let touch;
        if (activeTouchId === 'mouse') {
            touch = e;
        } else {
            touch = getTouch(e);
            if (!touch) return;
        }

        const pos = { x: touch.clientX, y: touch.clientY };
        let deltaX = pos.x - stickStartX;
        let deltaY = pos.y - stickStartY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > maxStickTravel) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxStickTravel;
            deltaY = Math.sin(angle) * maxStickTravel;
        }

        joystickHandle.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;

        state.analogMove = deltaY / maxStickTravel; 
        state.analogRot = -deltaX / maxStickTravel;
    }

    function onStickEnd(e) {
        if (activeTouchId === null) return;
        
        let isEnding = false;
        if (activeTouchId === 'mouse') {
            if (e.button === 0) isEnding = true;
        } else {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeTouchId) {
                    isEnding = true;
                    break;
                }
            }
        }

        if (!isEnding) return;
        if (e.preventDefault) e.preventDefault();
        
        activeTouchId = null;
        state.analogMove = 0;
        state.analogRot = 0;
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    }

    joystickArea.addEventListener("touchstart", onStickStart, { passive: false });
    window.addEventListener("touchmove", onStickMove, { passive: false });
    window.addEventListener("touchend", onStickEnd, { passive: false });
    window.addEventListener("touchcancel", onStickEnd, { passive: false });

    joystickArea.addEventListener("mousedown", onStickStart, { passive: false });
    window.addEventListener("mousemove", onStickMove, { passive: false });
    window.addEventListener("mouseup", onStickEnd, { passive: false });
}