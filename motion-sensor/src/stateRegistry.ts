export interface MotionState {
  motionDetected: boolean // TODO: modifier le front pour ajouter un timer
  battery: number        // 0 à 100 en gros
  lastSeen?: string | null // dernier mouvement détecté
}

export interface DefaultMotionState {
  readonly motionDetected: boolean
  readonly battery: number
  readonly lastSeen?: string | null
}

export const motionState: MotionState = {
  motionDetected: false,
  battery: 100,
  lastSeen: null
}

export const defaultMotionState: DefaultMotionState = {
  motionDetected: false,
  battery: 100,
  lastSeen: null
}