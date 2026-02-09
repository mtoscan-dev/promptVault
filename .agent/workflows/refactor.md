---
description: Systematic refactoring workflow for code quality improvement
---

Use this workflow when improving code structure, readability, or performance.

## 🔍 Phase 1: Code Smell Identification

### Common Code Smells
- [ ] Duplicated Code
- [ ] Long Method/Function - exceeds 50 lines
- [ ] Large Class/Module
- [ ] Long Parameter List
- [ ] Feature Envy
- [ ] Data Clumps
- [ ] Primitive Obsession
- [ ] Switch Statement Abuse
- [ ] Dead Code

### Run Analysis Tools
```bash
# Platform-specific linting and analysis

# Node.js
# npx eslint . --ext .js,.ts
# npx jscpd src/  (duplicate detection)

# Python
# ruff check .
# pylint src/
# flake8

# Go
# golangci-lint run
# go vet ./...

# Rust
# cargo clippy
# cargo fmt --check

# General
# Use your IDE's built-in code analysis
```

## ✅ Phase 2: Test Coverage Check

1. **Run Existing Tests**
   ```bash
   # Node.js: npm test -- --coverage
   # Python: pytest --cov=src
   # Go: go test -cover ./...
   # Rust: cargo tarpaulin
   # Java: mvn test jacoco:report
   ```

2. **Analyze Coverage**
   - Check test coverage for refactoring targets
   - Identify missing test cases

3. **Build Safety Net**
   - Add essential tests before refactoring
   - Ensure core functionality is protected

## 🔧 Phase 3: Incremental Refactoring

### Refactoring Principles
1. **Small Steps**: One change at a time
2. **Frequent Commits**: Commit after each step
3. **Keep Tests Green**: Run tests after each step

### Common Refactoring Techniques
| Technique | Description |
|-----------|-------------|
| Extract Function | Extract code block into separate function |
| Inline Function | Inline unnecessary function |
| Extract Variable | Extract complex expression into variable |
| Rename | Change to clearer name |
| Move Function | Move function to appropriate module |
| Replace Conditional with Polymorphism | Replace conditionals with polymorphism |

### Checkpoint (after each step)
```bash
# Run tests, lint, and build for your platform
# Verify no regressions introduced
```

## 📊 Phase 4: Performance Benchmark

1. **Measure Before Refactoring**
   ```bash
   # Build time
   time <your-build-command>
   
   # Output size
   du -sh <output-directory>
   ```

2. **Compare After Refactoring**
   - Compare build time
   - Compare output size
   - Compare runtime performance (if applicable)

## 📝 Phase 5: Documentation & Cleanup

1. **Summarize Changes**
   - Document major refactoring items
   - List affected files

2. **Write PR (if applicable)**
   - Explain refactoring motivation
   - Provide before/after comparison

3. **Knowledge Sharing**
   - Add comments for future maintenance
   - Update team documentation
