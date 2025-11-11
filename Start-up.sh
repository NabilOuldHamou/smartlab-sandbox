#!/usr/bin/env bash

echo "Gateway installing and building..."
cd ./gateway && pnpm install && pnpm dev &
echo "Light installing and building..."
cd ./light && pnpm install && pnpm dev &
echo "Motion Sensor installing and building..."
cd ./motion-sensor && pnpm install && pnpm dev &
echo "web-app installing and building..."
cd ./web-interface && pnpm install && pnpm dev &
echo "All services started."