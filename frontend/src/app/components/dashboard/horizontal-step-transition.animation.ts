import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

// export type StepContentPositionState = 'previous' | 'current' | 'next';
export type StepContentPositionState = 'previous' | 'current' | 'next' | 'finish';

export function horizontalStepTransitionAnimation(options?: { anchor: string; duration: number }): AnimationTriggerMetadata {
  return trigger((options && options.anchor) || 'stepTransition', [
    // Initial state for the first 4 steps
    state('previous', style({ transform: 'translate3d(-50%, 0, 0)', display: 'none' })),
    state('current', style({ transform: 'none', display: 'block' })),
    state('next', style({ transform: 'translate3d(100%, 0, 0)', display: 'none' })),

    // State for the finish button
    state('finish', style({ transform: 'none', visibility: 'visible', display: 'block' })),

    // Transition for the first 4 steps
    transition('previous => current, current => next, next => previous', animate('0ms')), // Set duration to 0ms

    // Transition to show the finish button after 4 steps
    transition('* => finish', animate('0ms')), // Set duration to 0ms
  ]);
}

