#!/bin/bash

# AntiGravity Token Optimizer
# Identifies large files that might be consuming unnecessary tokens if included in context.

echo "--- AntiGravity Token Usage Optimization Report ---"
echo "Looking for files > 50KB in the current directory (excluding common ignored folders)..."
echo ""

# Find files larger than 50KB, excluding node_modules, .git, and common binary formats
find . -type f -size +50k \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/.next/*" \
    -not -name "*.png" \
    -not -name "*.jpg" \
    -not -name "*.jpeg" \
    -not -name "*.gif" \
    -not -name "*.svg" \
    -not -name "*.ico" \
    -not -name "*.pdf" \
    -not -name "*.zip" \
    -not -name "*.gz" \
    -not -name "package-lock.json" \
    -not -name "yarn.lock" \
    -exec ls -lh {} + | awk '{print $9 ": " $5}'

echo ""
echo "Recommendations:"
echo "1. Avoid adding these large files to your AI's chat context unless necessary."
echo "2. If a file is a log, consider truncating it: 'tail -n 100 logfile > small_log'."
echo "3. Use .cursorignore or .gitignore to prevent the AI from indexing these files."
echo "4. For large source files, use the 'Project Outline' script instead of providing the whole file."
