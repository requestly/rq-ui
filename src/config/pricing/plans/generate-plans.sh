#!/usr/bin/env bash

set -e

Usage() {
    echo "Usage $0 [env]. Possible values for env are beta|prod" && exit 1
}

if [[ -z $1 ]]; then
    Usage
fi

if [[ $1 == 'beta' ]] || [[ $1 == 'local' ]]; then
    echo "Generating PLANS.JSON for BETA env"
    cp beta-pricing-plans.json plans.json
    elif [[ $1 == 'prod' ]]; then
    echo "Generating PLANS.JSON for PROD env"
    cp prod-pricing-plans.json plans.json   
    
else
    Usage
fi