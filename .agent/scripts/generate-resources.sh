#!/bin/bash
# generate-resources.sh
# Scans a Project Template directory for personas/ and rules/ subdirectories,
# then generates or updates RESOURCES.md in the current project root.
#
# The template directory can be located OUTSIDE of the current project.
# Parses each persona file for a "### Rules" section to find associated rules.
# IMPORTANT: Synchronizes RESOURCES.md with the template directory (adds new, REMOVES missing).
#
# Usage: ./generate-resources.sh <full-path-to-project-template>
# Example: ./generate-resources.sh /Users/mike/Work/proyect-template

set -euo pipefail

# --- Validate arguments ---
TEMPLATE_PATH="${1:-/Users/mike/Work/proyect-template}"

if [ -z "$TEMPLATE_PATH" ]; then
  echo "❌ Error: Template path could not be determined."
  echo "Usage: $0 [full-path-to-project-template]"
  exit 1
fi

if [ ! -d "$TEMPLATE_PATH" ]; then
  echo "❌ Error: Path '$TEMPLATE_PATH' does not exist or is not a directory."
  exit 1
fi

TEMPLATE_PATH="$(cd "$TEMPLATE_PATH" && pwd)"

if [ ! -r "$TEMPLATE_PATH" ]; then
  echo "❌ Error: No read permission on '$TEMPLATE_PATH'."
  exit 1
fi

PERSONAS_DIR="$TEMPLATE_PATH/personas"
RULES_DIR="$TEMPLATE_PATH/rules"

if [ ! -d "$PERSONAS_DIR" ]; then
  echo "❌ Error: 'personas/' directory not found inside: $TEMPLATE_PATH"
  exit 1
fi

if [ ! -d "$RULES_DIR" ]; then
  echo "⚠️  Warning: 'rules/' directory not found inside: $TEMPLATE_PATH"
  echo "   Proceeding with personas only."
fi

# --- Find project root ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_FILE="$PROJECT_ROOT/RESOURCES.md"

# --- Function: extract description from persona file ---
# Extracts the 'description:' field from the YAML frontmatter.
extract_description() {
  local file="$1"
  local description=""
  
  # Use awk to parse the YAML frontmatter block (between first two ---)
  # look for line starting with "description:"
  description=$(awk '
    BEGIN { in_frontmatter = 0; }
    /^---$/ { 
      if (in_frontmatter == 0) { in_frontmatter = 1; next; }
      else { exit; } 
    }
    in_frontmatter == 1 && /^description:/ {
      # Print everything after "description:"
      $1=""; print $0; exit;
    }
  ' "$file" | sed 's/^ *//' | sed 's/^"//' | sed 's/"$//')

  echo "$description"
}

# --- Function: extract rules from persona file ---
extract_rules() {
  local file="$1"
  local in_rules=false
  local rules=""

  while IFS= read -r line; do
    if echo "$line" | grep -qE '^### Rules'; then
      in_rules=true
      continue
    fi

    if $in_rules; then
      if echo "$line" | grep -qE '^#{1,3} ' || echo "$line" | grep -qE '^---'; then
        break
      fi
      if echo "$line" | grep -qE '^- .+\.md'; then
        rule_name=$(echo "$line" | sed 's/^- //' | xargs)
        if [ -n "$rules" ]; then
          rules="$rules, $rule_name"
        else
          rules="$rule_name"
        fi
      fi
    fi
  done < "$file"

  echo "$rules"
}

# --- Function: build source files display string ---
# Combines Persona path and Rules path into a single column
build_source_display() {
  local persona_path="$1"
  local rules="$2"
  local source_display=""

  # Add Persona File
  source_display="👤 **Persona**: \`$persona_path\`"

  # Add Rules if present
  if [ -n "$rules" ]; then
    source_display="$source_display<br/>⚙️ **Rules**:"
    IFS=',' read -ra rule_items <<< "$rules"
    for rule_item in "${rule_items[@]}"; do
      rule_item=$(echo "$rule_item" | xargs)
      rule_path="$RULES_DIR/$rule_item"
      if [ -f "$rule_path" ]; then
         source_display="$source_display <br/>&nbsp;&nbsp;└─ \`$rule_path\`"
      else
         source_display="$source_display <br/>&nbsp;&nbsp;└─ ⚠️ \`$rule_item\` (not found)"
      fi
    done
  fi

  echo "$source_display"
}

# --- Generate RESOURCES.md from scratch (Synchronization) ---
echo "🔄 Synchronizing RESOURCES.md with template..."

added_count=0

{
	echo "# 📦 Resources"
	echo ""
	echo "Auto-generated resource manifest."
	echo ""
	echo "**Template Path**: \`$TEMPLATE_PATH\`"
	echo ""
	echo "---"
	echo ""
	echo "## 👥 Available Personas"
	echo ""
	echo "| Name | Description | Source Files |"
	echo "| ---- | ----------- | ------------ |"

	for persona_file in "$PERSONAS_DIR"/*.md; do
	  [ -f "$persona_file" ] || continue

	  basename_file="$(basename "$persona_file")"
	  name="${basename_file%.md}"

	  description=$(extract_description "$persona_file")
      # Fallback description if empty
      if [ -z "$description" ]; then
        description="—"
      fi

	  rules=$(extract_rules "$persona_file")
	  source_display=$(build_source_display "$PERSONAS_DIR/$basename_file" "$rules")

	  echo "| \`$name\` | $description | $source_display |"
	  added_count=$((added_count + 1))
	done

} > "$OUTPUT_FILE"

# --- Summary ---
persona_count=$(find "$PERSONAS_DIR" -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
rule_count=0
if [ -d "$RULES_DIR" ]; then
  rule_count=$(find "$RULES_DIR" -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
fi

echo ""
echo "✅ RESOURCES.md synchronized at: $OUTPUT_FILE"
echo "   Template: $TEMPLATE_PATH"
echo "   Personas in template: $persona_count"
echo "   Rules in template: $rule_count"
echo "   Total Personas Listed: $added_count"
