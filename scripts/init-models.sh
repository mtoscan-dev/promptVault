#!/bin/bash

# freeLLMAPI manages models via its dashboard (http://localhost:3001).
# Models are configured in the dashboard → Providers → Models.
# The following models are required for Vault functionality:
# - For prompts: any text generation model (e.g., google/gemma-4-12b)
# - For embeddings: nomic-embed-text or compatible (768-dim)
#
# After configuring models in the dashboard, verify availability:
# curl -s http://127.0.0.1:3001/v1/models -H "Authorization: Bearer YOUR_API_KEY"
#
# The DEFAULT_MODEL and EMBEDDING_MODEL in .env must match exactly
# the model IDs reported by freeLLMAPI's /v1/models endpoint.

echo "ℹ️  freeLLMAPI manages models via dashboard (http://localhost:3001)"
echo "   Required models (check in dashboard):"
echo "   - Text generation (e.g., google/gemma-4-12b)"
echo "   - Embeddings (nomic-embed-text, 768-dim)"
echo ""
echo "Verify models after setup:"
echo "   curl -s http://127.0.0.1:3001/v1/models -H \"Authorization: Bearer YOUR_API_KEY\""
