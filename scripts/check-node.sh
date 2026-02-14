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

# 1. VERIFY OLLAMA CONNECTION
echo -e "${AMBER}📡 Verifying connection with Ollama engine...${NC}"
if curl -s -f "$OLLAMA_HOST/api/tags" > /dev/null; then
    echo -e "${GREEN}✅ Ollama is ONLINE at $OLLAMA_HOST${NC}"
else
    echo -e "${RED}❌ ERROR: Could not contact Ollama.${NC}"
    echo -e "Ensure the 'vault_ai' container is running."
    exit 1
fi

# 2. VERIFY MODEL AVAILABILITY
# Checking for Qwen 2.5 (preferred for 8GB RAM optimization)
echo -e "${AMBER}🧠 Searching for operational model: $DEFAULT_MODEL...${NC}"
MODELS_LIST=$(curl -s "$OLLAMA_HOST/api/tags")

if [[ $MODELS_LIST == *"$DEFAULT_MODEL"* ]]; then
    echo -e "${GREEN}✅ Model $DEFAULT_MODEL detected and ready for inference.${NC}"
else
    echo -e "${AMBER}⚠️  Model not detected. Initiating Pull...${NC}"
    echo -e "This may take a few minutes depending on your Patagonian connection."
    curl -X POST "$OLLAMA_HOST/api/pull" -d "{\"name\": \"$DEFAULT_MODEL\"}"
    echo -e "${GREEN}✅ Download complete.${NC}"
fi

# 3. RESOURCE AUDIT (8GB RAM CHECK)
echo -e "${AMBER}📊 Checking node memory status...${NC}"
FREE_RAM=$(free -h | grep Mem | awk '{print $4}')
echo -e "Available System RAM: ${CYAN}$FREE_RAM${NC}"

echo -e "\n${GREEN}===================================================="
echo -e "🚀 NODE READY FOR SOVEREIGN OPERATIONS"
echo -e "====================================================${NC}"