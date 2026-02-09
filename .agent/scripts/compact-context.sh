#!/bin/bash

# AntiGravity Context Prepper (macOS/Linux)
# Reduces token usage by providing a compact representation of the project structure and key files.

OUTPUT_FILE=".agent/scripts/context_summary.md"
EXCLUDE_PATTERNS="node_modules|.git|dist|build|.next|out|*.log|*.png|*.jpg|*.jpeg|*.gif|*.svg|*.ico|*.pdf|*.zip|*.gz|*.tar|package-lock.json|yarn.lock"

echo "Generating compact context at $OUTPUT_FILE..."

{
  echo "# Project Context Summary"
  echo "Generated on: $(date)"
  echo ""
  echo "## Directory Structure"
  echo "\`\`\`"
  if command -v tree >/dev/null 2>&1; then
    tree -L 3 -I "$EXCLUDE_PATTERNS"
  else
    find . -maxdepth 3 -not -path '*/.*' | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
  fi
  echo "\`\`\`"
  echo ""
  echo "## Key Configuration Files"

  # List of essential files to include
  CONFIG_FILES=("package.json" "tsconfig.json" ".cursorrules" "README.md")

  for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
      echo "### $file"
      echo "\`\`\`$(echo ${file##*.} | sed 's/json/json/')"
      cat "$file"
      echo "\`\`\`"
      echo ""
    fi
  done

  echo "## Active Source Outline (Brief)"
  find src -maxdepth 2 -not -path '*/.*' 2>/dev/null | sed 's/^/- /'
} > "$OUTPUT_FILE"

echo "Done! You can now provide .agent/scripts/context_summary.md to AntiGravity to give it a head start."
