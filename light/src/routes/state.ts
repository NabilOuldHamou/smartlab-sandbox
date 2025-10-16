import { Hono } from "hono";

const state = new Hono();

state.get("/", async (c) => {
    // todo return device data
});

export default state;