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

# freeLLMAPI always runs on localhost:3001
CHECK_HOST="http://127.0.0.1:3001"

# 1. VERIFY FREELLMAPI CONNECTION
echo -e "${AMBER}📡 Verifying connection with freeLLMAPI at $CHECK_HOST...${NC}"

if curl -s -f "${CHECK_HOST}/v1/models" > /dev/null; then
    echo -e "${GREEN}✅ freeLLMAPI (API) is ONLINE at $CHECK_HOST${NC}"
else
    echo -e "${RED}❌ ERROR: Could not contact freeLLMAPI at $CHECK_HOST${NC}"
    echo -e "Ensure the freeLLMAPI container is running: docker ps | grep freellmapi"
    echo -e "Start with: docker compose up -d freellmapi (or run freellmapi manually)"
    exit 1
fi

# 2. VERIFY MODEL AVAILABILITY (via freeLLMAPI)
echo -e "${AMBER}🧠 Searching for operational model: $DEFAULT_MODEL...${NC}"

MODELS_LIST=$(curl -s -H "Authorization: Bearer ${LLM_API_KEY:-freeapi}" "${CHECK_HOST}/v1/models" 2>/dev/null || echo "")

if [[ $MODELS_LIST == *"$DEFAULT_MODEL"* ]]; then
    echo -e "${GREEN}✅ Model $DEFAULT_MODEL detected in freeLLMAPI.${NC}"
else
    echo -e "${AMBER}⚠️  Model $DEFAULT_MODEL not found in freeLLMAPI.${NC}"
    echo -e "Available models (sample):"
    echo "$MODELS_LIST" | head -c 2000 || echo "(unable to list)"
    echo ""
    echo -e "Configure models in freeLLMAPI dashboard: http://localhost:3001"
    echo -e "Note: freeLLMAPI requires a valid API key in .env LLM_API_KEY."
    # Don't exit 1 — model may be added later, or user may configure manually
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
