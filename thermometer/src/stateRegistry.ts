export interface ThermometerState {
  currentTemperature: number; // température actuelle
  targetTemperature: number; // température cible
  mode: "ECO" | "COMFORT" | "OFF"; // mode de fonctionnement
  heating: boolean; // indique si le chauffage est actif
}

export const registration = {
  registered: false,
  id: "",
  token: "",
  eventRoute: "",
  heartbeatRoute: "",
};

export const currentState: ThermometerState = {
  currentTemperature: 15,
  targetTemperature: 19,
  mode: "OFF",
  heating: false,
};
