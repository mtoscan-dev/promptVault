# FreeLLMAPI local — infraestructura del proyecto

> **Contexto para agentes/sesiones futuras**: este documento describe la infraestructura de FreeLLMAPI instalada en esta máquina, para que cualquier sesión de Bionic que trabaje en este proyecto (Hermes) sepa que existe, dónde vive, y cómo operarla sin redescubrirlo.

**Estado**: operativo, verificado por última vez el **2026-09-26**.
**Doc de referencia completa**: `/home/mike/Documentos/tutorial-freellmapi-api-local-hermes.md` (tutorial paso a paso del setup).
**Wiki**: vault `hermes` → `entities/freellmapi.md`, `sources/freellmapi.md`, `sources/freellmapi-setup-hermes.md` (`~/vaults/hermes/`).

---

## 1. Qué es y dónde corre

**FreeLLMAPI** es un router/gateway MIT que agrega free tiers de proveedores LLM detrás de un único endpoint **OpenAI-compatible local**. Hermes le habla con una sola API key; el router elige el mejor modelo disponible por request y hace fallover automático.

| Componente | Ubicación / valor |
|---|---|
| Instalación (build de producción, sin Docker) | `~/freellmapi` (clon de `github.com/tashfeenahmed/freellmapi`, rama `main`) |
| Endpoint API | `http://localhost:3001/v1` (superficie OpenAI completa; también `/v1/messages` estilo Anthropic, `/v1beta` estilo Gemini) |
| Dashboard | `http://localhost:3001` (login local email+password; reset imprime código en el log) |
| Base de datos (SQLite, keys cifradas AES-256-GCM) | `~/freellmapi/server/data/freeapi.db` |
| `ENCRYPTION_KEY` (cifra las keys en DB — **irrecuperable si se pierde**) | `~/freellmapi/.env` (junto con `PORT=3001`) |
| Servicio systemd de usuario | `~/.config/systemd/user/freellmapi.service` (linger activo: arranca con la máquina) |
| Logs | `journalctl --user -u freellmapi -f` |

## 2. Proveedores configurados (2026-09-26)

Keys de proveedores cargadas en el dashboard, todas healthy:

- **Cloud**: Groq, Google (AI Studio), OpenRouter, NVIDIA (NIM), HuggingFace (Router).
- **Custom provider "LM Studio"**: base URL `http://127.0.0.1:1234/v1` (el LM Studio local), modelos declarados a mano: `openai/gpt-oss-20b`, `qwen/qwen2.5-coder-14b`, `google/gemma-4-e4b` (los tres con soporte de tools) y `text-embedding-nomic-embed-text-v1.5` (embeddings). Actúan como fallback local **sin límite de tokens** cuando los free tiers se agotan. Requiere LM Studio corriendo con su servidor activo.

El catálogo se auto-sincroniza desde freellmapi.co (snapshot mensual en installs gratis). A la fecha: **317 modelos $0** disponibles.

## 3. Cómo está conectado Hermes

- **El default de Hermes NO cambió**: sigue siendo `provider: lmstudio` → `http://127.0.0.1:1234/v1`, modelo `openai/gpt-oss-20b` (LM Studio directo, sin FreeLLMAPI en el medio).
- FreeLLMAPI está conectado como **perfil aparte** `freellmapi-freetier` en `~/.hermes/config.yaml` (bloque `providers:`), creado con el generador oficial:
  ```
  node ~/freellmapi/cli/dist/index.js setup-hermes --url http://localhost:3001 --api-key <unified> --profile freetier
  ```
- La API key unificada (`freellmapi-…`) vive en `~/.hermes/.env` como **`FREELLMAPI_API_KEY`** (referenciada desde config.yaml vía `${FREELLMAPI_API_KEY}`). **No hardcodear en config.yaml ni en este documento.**
- Uso dentro de un chat de Hermes: `/model custom:freellmapi-freetier:auto` (o `auto:fast`, `auto:smart`, o un id de modelo específico del catálogo). Volver al local: `/model openai/gpt-oss-20b`.
- **El gateway de Hermes NO recarga config en caliente**: después de cambiar `config.yaml` o `.env`, correr `hermes gateway restart`.
- **Fallback chain de los perfiles del equipo de investigación (2026-09-26)**: `researcher`, `orchestrator` y `research` tienen `fallback_model: [{provider: freellmapi-freetier, model: auto}]` — si gpt-oss-20b vía LM Studio falla (rate-limit/5xx/conexión), el turno reintenta con `auto` del router. **Los perfiles NO heredan el config/.env de launch scope**: el bloque `providers: freellmapi-freetier` está duplicado en el `config.yaml` de cada perfil y `FREELLMAPI_API_KEY` en el `.env` de cada perfil. Backups: `~/.hermes/profiles/<p>/config.yaml.backup-before-fallback` y `.env.backup-before-searxng-url`. Verificación: `hermes -p researcher fallback list` y `hermes -p researcher chat -q "ping" -m freellmapi-freetier/auto`.
- **Perfil `sew` (2026-09-26, bibliotecario del vault `~/vaults/sew`)**: FreeLLMAPI como modelo **principal** (inverso del patrón research): `model: {default: auto, provider: custom, base_url: http://localhost:3001/v1, api_mode: chat_completions}` + `fallback_model: [{provider: lmstudio, model: openai/gpt-oss-20b}]` (si el router no responde, reintenta con LM Studio directo). La key vive en el `.env` del perfil como `HERMES_CUSTOM_LOCALHOST_3001_API_KEY` (nombre auto-generado, distinto de `FREELLMAPI_API_KEY`; mismo valor). Config: `~/.hermes/profiles/sew/config.yaml` (backups `*.backup-before-sew-fix`). Verificado en vivo: ping servido por el router (`model=auto provider=custom`, upstream AtlasCloud). Latencia de un ping simple ~63s — caveat de free tiers: irrelevante para ingest, molesta para prompts cortos interactivos (si molesta, `/model auto:fast` o reordenar la fallback chain en el dashboard).

## 4. Operaciones habituales (copiar/pegar)

```bash
systemctl --user status freellmapi        # estado
systemctl --user restart freellmapi      # reiniciar
journalctl --user -u freellmapi -f       # logs en vivo

# Actualizar FreeLLMAPI (DB y .env sobreviven):
cd ~/freellmapi && git pull && npm install && npm run build && systemctl --user restart freellmapi

# Test rápido del router (ver X-Routed-Via para saber qué proveedor atendió):
curl -s http://localhost:3001/v1/chat/completions \
  -H "Authorization: Bearer $(grep '^FREELLMAPI_API_KEY=' ~/.hermes/.env | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"model":"auto","messages":[{"role":"user","content":"ping"}]}' -D - | grep -i x-routed-via

# Test de Hermes a través del perfil:
hermes -z "Say hello" -m custom:freellmapi-freetier:auto
```

## 5. Para futuras configuraciones / actualizaciones

- **Agregar un proveedor o modelo**: por dashboard (Keys / Models) o por CLI con token de sesión del dashboard (`node ~/freellmapi/cli/dist/index.js keys add|list|remove|test <platform>`).
- **Apuntar otro perfil/tool de Hermes a FreeLLMAPI**: base URL `http://localhost:3001/v1` + key `${FREELLMAPI_API_KEY}` (ya está en `.env`, no duplicarla). Vale para main model, fallbacks, perfiles de Hermes, compaction, embeddings, etc.
- **Cambiar el default de Hermes a FreeLLMAPI** (si algún día se decide): re-ejecutar `setup-hermes` **sin** `--profile`, o editar el bloque `model:` (provider `custom`, base_url `:3001/v1`). Backups previos: `~/.hermes/config.yaml.backup-*`.
- **Otros clientes**: cualquier app OpenAI-compatible puede usar `http://localhost:3001/v1` con la key unificada (no solo Hermes).

## 6. Gotchas conocidos

- **`npx freellmapi` falla** (`freellmapi: not found`): usar el CLI compilado del clone → `node ~/freellmapi/cli/dist/index.js …`.
- El setup fue **sin Docker** y así sigue: no hay motivo para migrarlo. (Dato de entorno: Docker v29.1.3 quedó instalado en el host ese mismo día por la sesión paralela de SearXNG; `docker` requiere sudo para el usuario `mike` — sin grupo docker. Si algún día se migrara: config declarativa `FREEAPI_CONFIG_JSON` reproduce keys/providers al booteo, y el custom provider LM Studio pasaría a `http://host.docker.internal:1234/v1`.)
- Cuotas de proveedores: reset a medianoche UTC; la calidad del pool baja a fin del día. Sesiones sticky de 30 min por conversación.
- Catálogo gratis = snapshot mensual (novedades con ~30 días de retraso); nada expira ni se degrada.
- **LM Studio es dependencia del fallback local**: si no corre, esos modelos del chain quedan unhealthy (el router salta al siguiente sin romper nada).
- Documentación oficial: https://github.com/tashfeenahmed/freellmapi · catálogo: https://freellmapi.co/models

## 7. Rollback (por si hay que deshacer todo)

1. Restaurar `~/.hermes/config.yaml.backup-2026-09-26T02-57-30-467Z` → `config.yaml` y `~/.hermes/.env.backup-2026-09-26T02-57-30-468Z` → `.env`; `hermes gateway restart`.
2. `systemctl --user disable --now freellmapi && rm ~/.config/systemd/user/freellmapi.service && rm -rf ~/freellmapi` (la DB con las keys cifradas muere con la carpeta).
