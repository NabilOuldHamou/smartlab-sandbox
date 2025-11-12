export interface MotionState {
  motionDetected: boolean; // TODO: modifier le front pour ajouter un timer
  lastSeen?: number | null; // dernier mouvement détecté
}

export const registration = {
  registered: false,
  id: "",
  token: "",
  eventRoute: "",
  heartbeatRoute: "",
};

export const currentState: MotionState = {
  motionDetected: false,
  lastSeen: null,
};
