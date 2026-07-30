#!/bin/bash
export SKIP_DELAY=1
export SKIP_CHROME_PREP=1
exec "$(dirname "$0")/runScrapeJob.sh"
