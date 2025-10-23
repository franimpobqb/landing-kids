import { state } from './state.js';
import * as C from './config.js';

export function updateGameLogic() {
    if (!state.ferry || !state.showQuestionModal) return; // Not ready yet

    const shipWidth = C.SHIP_WIDTH; // Use collision radius

    for (const cp of state.checkpointObjs) {
        if (cp.reached) continue;

        const dist = state.ferry.position.distanceTo(cp.mesh.position);
        
        if (dist < shipWidth) {
            cp.reached = true; // Mark as reached immediately to prevent re-trigger
            state.showQuestionModal(cp);
        }
    }
}