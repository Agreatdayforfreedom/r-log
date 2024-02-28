#!/bin/bash
curl -X POST -d '{"username": "'$2'"}' -H "Content-Type: application/json" http://localhost:3000/join/$1