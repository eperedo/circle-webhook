#!/bin/bash
cd $1
pm2 deploy ecosystem.config.js $2 update --update-env