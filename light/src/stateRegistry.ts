export interface State {
  power: boolean;
  brightness: number;
  color: string;
}

export const registration = {
  registered: false,
  id: "",
  token: "",
  eventRoute: "",
  heartbeatRoute: "",
};

export const currentState: State = {
  power: true,
  brightness: 50,
  color: "#fff",
};
