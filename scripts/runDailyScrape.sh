#!/bin/bash
export SCRAPE_DELAY_SECONDS=$(( RANDOM % 3601 ))
exec "$(dirname "$0")/runScrapeJob.sh"
