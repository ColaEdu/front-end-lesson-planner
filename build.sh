#!/bin/bash

# Build the project
npm run build-prod

# SUFFIX_CODE
scp ./build/* ubuntu@43.134.126.166:/home/ubuntu/codes/lesson-planner-frontend/build
