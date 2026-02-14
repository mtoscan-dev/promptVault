#!/bin/bash

# Configuration
OLLAMA_CONTAINER="vault_ai"
REQUIRED_MODELS=("qwen2.5:1.5b" "nomic-embed-text")

echo "🔍 Checking Ollama status in container: $OLLAMA_CONTAINER..."

# Check if container is running
if ! docker ps | grep -q "$OLLAMA_CONTAINER"; then
    echo "❌ Container $OLLAMA_CONTAINER is not running."
    echo "   Please run './scripts/docker-start.sh' first."
    exit 1
fi

echo "✅ Ollama container is running."

# Pull models
for model in "${REQUIRED_MODELS[@]}"; do
    echo "⬇️  Pulling model: $model..."
    docker exec "$OLLAMA_CONTAINER" ollama pull "$model"
    if [ $? -eq 0 ]; then
        echo "✅ Model $model ready."
    else
        echo "❌ Failed to pull $model."
        exit 1
    fi
done

echo "🎉 All AI models initialized successfully!"
