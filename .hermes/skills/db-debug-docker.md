# DB Debug Docker

Use when Next.js fails with DB connection errors while running outside Docker (e.g., `pnpm run dev` shows `Failed query: select ... from "settings"` but the container appears healthy).

## Procedure

1. **Verify DB container is running**
   ```bash
   docker ps | grep -i vault
   # or match your container name pattern
   ```
   If missing, start with:
   ```bash
   docker compose up -d db
   sleep 5
   docker ps | grep -i vault
   ```

2. **Verify table and row exist**
   ```bash
   docker exec <container_name> psql -U <user> -d <db_name> -c '\dt'
   docker exec <container_name> psql -U <user> -d <db_name> -c 'SELECT * FROM <table>;'
   ```
   Example:
   ```bash
   docker exec vault_db psql -U admin -d promptvault_db -c '\dt'
   docker exec vault_db psql -U admin -d promptvault_db -c 'SELECT * FROM settings;'
   ```

3. **Verify DATABASE_URL in `.env` matches container credentials**
   ```bash
   grep 'DATABASE_URL=' .env
   ```
   If password is masked (`***`) or incorrect, fix with `sed`:
   ```bash
   sed -i 's|postgresql://<user>:<oldpass>@|postgresql://<user>:<newpass>@|' .env
   ```
   Example:
   ```bash
   sed -i 's|postgresql://admin:***@|postgresql://admin:secret@|' .env
   grep 'DATABASE_URL=' .env  # Verify
   ```

4. **Restart Next.js dev server**
   - Next.js does NOT reload `.env` at runtime — change requires restart
   - Stop current `pnpm run dev` with Ctrl+C
   - Restart with `pnpm run dev`

## Pitfalls

- **Don't assume `localhost` works from outside Docker**: If the `.env` uses `localhost` but the container binds to `127.0.0.1`, try both. Use `127.0.0.1` if `localhost` resolves to IPv6 first and the DB server doesn't accept IPv6.
- **`.env` masking is intentional**: The project uses `***` in `DATABASE_URL` to avoid committing secrets. After container reset or credential change, you MUST restore the real password with `sed`.
- **Container restart clears DB state**: If you run `docker compose up -d db` after `docker compose down`, you may lose data and need to re-run migrations and seeds.
- **Next.js `.env` reload**: Changes to `.env` only take effect when Next.js starts. Hot reload does NOT re-read `.env`.

## References

- `.env.example` and `.env` contain the canonical credential patterns and expected values
- `docker-compose.yaml` defines `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — these are the source of truth for credentials when running in Docker
- Check `drizzle/0000_aromatic_proteus.sql` to verify table structure matches your queries
