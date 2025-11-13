
export interface ThermostatState {
  currentTemperature: number      // température mesurée actuelle
  targetTemperature: number       // consigne souhaitée
  mode: "off" | "eco" | "confort" | "manual" // eco = 17°C, confort = 19°C
  hvacRunning: boolean            // si le chauffage/clim tourne
  lastUpdated?: string | null     // date du dernier changement
}

export interface DefaultThermostatState {
  readonly currentTemperature: number
  readonly targetTemperature: number
  readonly mode: "off" | "eco" | "confort" | "manual"
  readonly hvacRunning: boolean
  readonly lastUpdated?: string | null
}

export const thermostatState: ThermostatState = {
  currentTemperature: 20,
  targetTemperature: 21,
  mode: "confort",
  hvacRunning: false,
  lastUpdated: null,
}

export const defaultThermostatState: DefaultThermostatState = {
  currentTemperature: 20,
  targetTemperature: 21,
  mode: "confort",
  hvacRunning: false,
  lastUpdated: null,
}

export const thermostatCapabilities = {
  temperature: {
    unit: "C",
    range: [5, 35],
    type: "number",
  },
  mode: ["off", "eco", "confort", "manual"],
}