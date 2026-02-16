#!/bin/bash

# --- COLOR CONFIGURATION ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load variables to identify the node and model
source .env

echo -e "${CYAN}🏔️  STARTING NODE DIAGNOSTIC: ${PATAGONIA_NODE_ID}${NC}"

# Override OLLAMA_HOST for local host execution
# This script runs on your machine, so we always want localhost, even if .env says host.docker.internal
CHECK_HOST="http://localhost:11434"

# 1. VERIFY OLLAMA CONNECTION
echo -e "${AMBER}📡 Verifying connection with Ollama engine at $CHECK_HOST...${NC}"

if command -v ollama &> /dev/null; then
    # PREFERRED: Use native CLI
    if ollama list &> /dev/null; then
        echo -e "${GREEN}✅ Ollama (CLI) is responding.${NC}"
    else
        echo -e "${RED}❌ ERROR: Ollama CLI detected but not responding.${NC}"
        echo -e "Ensure the Ollama app is running."
        exit 1
    fi
elif curl -s -f "$CHECK_HOST/api/tags" > /dev/null; then
    # FALLBACK: Use HTTP API
    echo -e "${GREEN}✅ Ollama (API) is ONLINE at $CHECK_HOST${NC}"
else
    echo -e "${RED}❌ ERROR: Could not contact Ollama at $CHECK_HOST${NC}"
    echo -e "Ensure the Ollama app is running on your Mac."
    exit 1
fi

# 2. VERIFY MODEL AVAILABILITY
echo -e "${AMBER}🧠 Searching for operational model: $DEFAULT_MODEL...${NC}"

if command -v ollama &> /dev/null; then
    # Use CLI to check and pull
    if ollama list | grep -q "$DEFAULT_MODEL"; then
        echo -e "${GREEN}✅ Model $DEFAULT_MODEL detected.${NC}"
    else
        echo -e "${AMBER}⚠️  Model not detected. Initiating download of $DEFAULT_MODEL...${NC}"
        ollama pull "$DEFAULT_MODEL"
    fi
else
    # Fallback to API check (legacy)
    MODELS_LIST=$(curl -s "$CHECK_HOST/api/tags")
    if [[ $MODELS_LIST == *"$DEFAULT_MODEL"* ]]; then
        echo -e "${GREEN}✅ Model $DEFAULT_MODEL detected.${NC}"
    else
        echo -e "${RED}❌ Model $DEFAULT_MODEL not found and 'ollama' CLI missing.${NC}"
        echo -e "Please install Ollama CLI or manually pull the model."
        exit 1
    fi
fi

# 3. RESOURCE AUDIT (RAM CHECK)
echo -e "${AMBER}📊 Checking node memory status...${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - Calculate available RAM (Free + Inactive + Speculative)
    vm_stat_out=$(vm_stat)
    pages_free=$(echo "$vm_stat_out" | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    pages_inactive=$(echo "$vm_stat_out" | grep "Pages inactive" | awk '{print $3}' | sed 's/\.//')
    pages_speculative=$(echo "$vm_stat_out" | grep "Pages speculative" | awk '{print $3}' | sed 's/\.//')
    
    total_free_pages=$((pages_free + pages_inactive + pages_speculative))
    FREE_RAM_MB=$((total_free_pages * 4096 / 1024 / 1024))
    
    echo -e "Available System RAM: ${CYAN}~${FREE_RAM_MB} MB${NC}"
else
    # Linux
    FREE_RAM=$(free -h | grep Mem | awk '{print $4}')
    echo -e "Available System RAM: ${CYAN}$FREE_RAM${NC}"
fi

echo -e "\n${GREEN}===================================================="
echo -e "🚀 NODE READY FOR SOVEREIGN OPERATIONS"
echo -e "====================================================${NC}"