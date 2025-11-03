export interface State {
    isOn: boolean
    brightness: number
    colour: string
}

export interface DefaultState {
    readonly isOn: boolean
    readonly brightness: number
    readonly colour: string
}

export const currentState: State = {
    isOn: true,
    brightness: 50,
    colour: "#000"
}

export const defaultSettings: DefaultState = {
    isOn: true,
    brightness: 50,
    colour: "#000"
}