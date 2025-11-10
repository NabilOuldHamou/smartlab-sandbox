export interface State {
  power: boolean;
  brightness: number;
  color: string;
}

export const registration = {
  registered: false,
  id: "",
};

export const currentState: State = {
  power: true,
  brightness: 50,
  color: "#000",
};

export const capabilities = {
  power: "boolean",
  brightness: {
    range: [1, 100],
    type: "number",
  },
  color: "hex",
};
