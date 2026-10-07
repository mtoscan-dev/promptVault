# PromptVault Scripts Guide

This guide explains how and when to use each of the shell scripts included in the PromptVault project. These scripts automate common tasks such as starting/stopping services, backing up data, rotating secrets, and checking system status.

## Table of Contents

1. [`init-bunker.sh`](#init-bunkersh)
2. [`docker-start.sh`](#docker-startsh)
3. [`docker-stop.sh`](#docker-stopsh)
4. [`check-node.sh`](#check-nodesh)
5. [`init-models.sh`](#init-modelssh)
6. [`pg-dump.sh`](#pg-dumpsh)
7. [`load-seed.sh`](#load-seedsh)
8. [`restore-bunker.sh`](#restore-bunkersh)
9. [`rotate-secrets.sh`](#rotate-secretssh)

---

### `init-bunker.sh`

#### Purpose:
Sets up the basic project structure including essential directories and component stubs.

#### Scenario:
First-time setup after cloning the repository or resetting the project structure.

#### Usage:
```bash
chmod +x ./scripts/init-bunker.sh
./scripts/init-bunker.sh
```

---

### `docker-start.sh`

#### Purpose:
Starts all Docker containers (Next.js, PostgreSQL, freeLLMAPI), synchronizes the database schema, and ensures vector extensions are enabled.

#### Scenario:
After a clean installation or full shutdown; to bring up the development or production environment.

#### Usage:
```bash
chmod +x ./scripts/docker-start.sh
./scripts/docker-start.sh
```

---

### `docker-stop.sh`

#### Purpose:
Stops and removes all Docker containers and associated resources without losing persistent data.

#### Scenario:
Restarting the environment cleanly or before major configuration changes.

#### Usage:
```bash
chmod +x ./scripts/docker-stop.sh
./scripts/docker-stop.sh
```

---

### `check-node.sh`

#### Purpose:
Checks connectivity with freeLLMAPI, verifies the availability of the default model, and audits system resources like RAM.

#### Scenario:
Quick diagnostic before using AI features or verifying that freeLLMAPI is running properly.

#### Usage:
```bash
chmod +x ./scripts/check-node.sh
./scripts/check-node.sh
```

---

### `init-models.sh`

#### Purpose:
Provides guidance for configuring models in freeLLMAPI (non-executable script).

#### Scenario:
Setting up freeLLMAPI for the first time or verifying available models.

#### Usage:
```bash
cat ./scripts/init-models.sh
```

---

### `pg-dump.sh`

#### Purpose:
Creates a compressed backup of the PostgreSQL database.

#### Scenario:
Before making significant database changes or as part of automated maintenance routines.

#### Usage:
```bash
chmod +x ./scripts/pg-dump.sh
./scripts/pg-dump.sh
```

---

### `load-seed.sh`

#### Purpose:
Restores a previously created backup (`*.sql.gz`) into the database.

#### Scenario:
Recovering data from a previous point or migrating data between environments.

#### Usage:
```bash
chmod +x ./scripts/load-seed.sh
./scripts/load-seed.sh ./backups/promptvault_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

### `restore-bunker.sh`

#### Purpose:
Fully restores the database from a backup file.

#### Scenario:
Disaster recovery or transferring the node to another machine.

#### Usage:
```bash
chmod +x ./scripts/restore-bunker.sh
./scripts/restore-bunker.sh ./backups/promptvault_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

### `rotate-secrets.sh`

#### Purpose:
Generates new random passwords for the database and other sensitive keys, updating the `.env` file.

#### Scenario:
Periodic security improvement or key rotation after suspected compromise.

#### Usage:
```bash
chmod +x ./scripts/rotate-secrets.sh
./scripts/rotate-secrets.sh
```

---

## Summary by Use Case

| Action                            | Script                  |
|----------------------------------|-------------------------|
| Initial project structure        | `init-bunker.sh`        |
| Bring up the full environment    | `docker-start.sh`       |
| Shut down all services           | `docker-stop.sh`        |
| Diagnose AI node status          | `check-node.sh`         |
| Backup database                  | `pg-dump.sh`            |
| Restore data                     | `load-seed.sh` or `restore-bunker.sh` |
| Rotate sensitive keys            | `rotate-secrets.sh`     |
| Configure freeLLMAPI models      | `init-models.sh` (read-only) |

---