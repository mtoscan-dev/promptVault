---
description: Deep debugging workflow for finding root causes of complex bugs
---

Use this workflow when dealing with complex or hard-to-reproduce bugs.

## 🔍 Phase 1: Symptom Collection & Reproduction

1. **Document Symptoms**
   - Record exact error messages
   - Identify occurrence conditions and frequency
   - List affected features/pages

2. **Establish Reproduction Steps**
   - Create Minimal Reproducible Example (MRE)
   - Verify environment variables (OS, runtime version, browser, etc.)

## 📊 Phase 2: Log Analysis

1. **Collect Logs**
   ```bash
   # Check console/terminal output
   # Analyze network requests
   # Review server logs (if applicable)
   ```

2. **Trace Stack Trace**
   - Backtrack from error point
   - Analyze call stack
   - Identify related files and lines

## 🧪 Phase 3: Hypothesis Testing

1. **Create Hypothesis List**
   | Hypothesis | Likelihood | Verification Method |
   |------------|------------|---------------------|
   | Hypothesis 1 | High/Medium/Low | ... |
   | Hypothesis 2 | ... | ... |

2. **Incremental Verification**
   - Verify in order of likelihood
   - Write tests for each hypothesis
   - Record results

## 🎯 Phase 4: Root Cause Analysis (RCA)

1. **5 Whys Technique**
   - Why 1: Why did this error occur?
   - Why 2: Why was that condition met?
   - (Repeat until root cause is found)

2. **Confirm Root Cause**
   - Document the root cause
   - Identify affected code areas

## 🔧 Phase 5: Fix & Verification

1. **Implement Fix**
   - Prefer minimal invasive fixes
   - Write/update related tests

2. **Regression Testing**
   ```bash
   # Run existing tests (platform-specific)
   # Node.js: npm test / yarn test / pnpm test
   # Python: pytest / python -m unittest
   # Go: go test ./...
   # Rust: cargo test
   # Java: mvn test / gradle test
   
   # Run linter (platform-specific)
   # Node.js: npm run lint
   # Python: ruff check . / flake8
   # Go: golangci-lint run
   # Rust: cargo clippy
   
   # Run build (platform-specific)
   # Node.js: npm run build
   # Python: python -m build
   # Go: go build ./...
   # Rust: cargo build
   ```

3. **Reproduction Test**
   - Re-test using original reproduction steps
   - Confirm fix resolves the issue

## 📝 Phase 6: Documentation

1. **Write Bug Report**
   - Record symptoms, cause, and solution
   - Suggest future prevention measures

2. **Knowledge Sharing**
   - Share results with team (if applicable)
   - Update README or documentation
