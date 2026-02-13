---
name: docker
description: "Comprehensive guidelines for Docker containerization, security, and orchestration."
---

# 🐳 Docker Best Practices Rule

Comprehensive guidelines for Docker containerization, security, and orchestration.

## 1. Dockerfile Optimization

- **Multi-Stage Builds**: ALWAYS use multi-stage builds for production images to separate build tools from runtime artifacts.
- **Layer Caching**: Order instructions from least to most frequent changes. Copy package definitions (`package.json`, `go.mod`) and install dependencies _before_ copying source code.
- **Minimal Base Images**: Prefer `alpine` or `distroless` variants for the final runtime stage to reduce attack surface and image size.
- **.dockerignore**: ALWAYS include a `.dockerignore` file to exclude `node_modules`, `.git`, `.env`, and other unnecessary files from the build context.
- **User Directive**: NEVER run containers as root. Create a specific user (UID > 1000) and switch to it with `USER`.

## 2. Security Hardening

| Check         | Requirement                                                                                        |
| :------------ | :------------------------------------------------------------------------------------------------- |
| **Non-Root**  | Create and use a dedicated user/group (e.g., `nodejs:nodejs`).                                     |
| **Secrets**   | NEVER bake secrets into images. Use Docker Secrets (`--mount=type=secret`) or env vars at runtime. |
| **Updates**   | regularly update base images to patch system vulnerabilities.                                      |
| **Read-Only** | Where possible, run containers with a read-only root filesystem (`--read-only`).                   |

## 3. Docker Compose Patterns

```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      target: production
    # Health checks are mandatory for dependent services
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    # Resource limits prevent noisy neighbor issues
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
    # Standard security options
    security_opt:
      - no-new-privileges:true
```

## 4. Useful Diagnostic Commands

- **Analyze Image Size**: `docker history --no-trunc [image-name]`
- **Check Context**: `docker build --no-cache -t test .` (Watch upload size)
- **Scan Vulnerabilities**: `docker scout quickview [image-name]` or `trivy image [image-name]`
- **Inspect Config**: `docker-compose config` to validate compose files.
