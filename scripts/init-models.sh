#!/bin/bash

# Configuration
# Models required for Vault functionality
REQUIRED_MODELS=("qwen2.5:3b" "nomic-embed-text")

echo "🔍 Checking local Ollama installation..."

# Check if ollama is installed locally
if ! command -v ollama &> /dev/null; then
    echo "❌ 'ollama' command not found."
    echo "   Please install Ollama from https://ollama.com"
    exit 1
fi

echo "✅ Ollama detected."

# Pull models locally
for model in "${REQUIRED_MODELS[@]}"; do
    echo "⬇️  Pulling model (Host): $model..."
    ollama pull "$model"
    if [ $? -eq 0 ]; then
        echo "✅ Model $model ready."
    else
        echo "❌ Failed to pull $model."
        exit 1
    fi
done

echo "🎉 All AI models initialized successfully on Host!"
