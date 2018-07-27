#!/bin/sh

npm run build

rm -rf package
mkdir package

cp package.json package-lock.json main.js package/
cp -r build/ package/

cd package
npm install --only=production
cd ..

node_modules/.bin/asar pack package app.asar
