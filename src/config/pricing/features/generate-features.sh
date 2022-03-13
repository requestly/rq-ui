#!/usr/bin/env bash

set -e

Usage() {
    echo "Usage $0 [env]. Possible values for env are beta|prod" && exit 1
}

if [[ -z $1 ]]; then
    Usage
fi

if [[ $1 == 'beta' ]] || [[ $1 == 'local' ]]; then
    echo "Generating FEATURES.JSON for BETA env"
    cp beta-features.json features.json
    elif [[ $1 == 'prod' ]]; then
    echo "Generating FEATURES.JSON for PROD env"
    cp prod-features.json features.json
    
else
    Usage
fi
