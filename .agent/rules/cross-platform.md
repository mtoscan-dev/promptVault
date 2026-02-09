# 🌐 Cross-Platform Compatibility Rules

Ensure all code and commands work across Windows, macOS, and Linux.

## 1. Path Separators

| OS | Separator | Example |
|----|-----------|---------|
| Windows | `\` | `C:\Users\name\project` |
| macOS/Linux | `/` | `/home/name/project` |

### Best Practices
- Use path libraries (e.g., `path.join()` in Node.js, `os.path.join()` in Python)
- Avoid hardcoded path separators
- Use relative paths when possible

## 2. Shell Commands

### Common Differences
| Action | Unix (macOS/Linux) | Windows (CMD) | Windows (PowerShell) |
|--------|-------------------|---------------|---------------------|
| List files | `ls` | `dir` | `Get-ChildItem` or `ls` |
| Clear screen | `clear` | `cls` | `Clear-Host` or `cls` |
| Environment var | `export VAR=val` | `set VAR=val` | `$env:VAR="val"` |
| Print var | `echo $VAR` | `echo %VAR%` | `echo $env:VAR` |
| Delete file | `rm file` | `del file` | `Remove-Item file` |
| Delete dir | `rm -rf dir` | `rmdir /s /q dir` | `Remove-Item -Recurse dir` |

### Cross-Platform Recommendations
```bash
# Use cross-platform tools when possible
# Node.js: cross-env, rimraf, shx
# Python: shutil, os module
# Go: filepath package
```

## 3. Line Endings

| OS | Line Ending | Character |
|----|-------------|-----------|
| Windows | CRLF | `\r\n` |
| macOS/Linux | LF | `\n` |

### Git Configuration
```bash
# Auto-convert on commit
git config --global core.autocrlf true   # Windows
git config --global core.autocrlf input  # macOS/Linux
```

## 4. Executables

| Type | Unix | Windows |
|------|------|---------|
| Scripts | `./script.sh` | `script.bat` or `script.ps1` |
| Binaries | `./program` | `program.exe` |
| Permissions | `chmod +x file` | Not applicable |

## 5. Environment Variables

### Detection
```bash
# Detect OS in shell
uname -s  # Returns: Linux, Darwin (macOS), or fails on Windows
```

```javascript
// Node.js
process.platform  // 'win32', 'darwin', 'linux'
```

```python
# Python
import platform
platform.system()  # 'Windows', 'Darwin', 'Linux'
```
