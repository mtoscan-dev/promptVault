## Fase 1: Estructura Global y Navegación (Layout)

- [ ] **Rediseñar SideMenubar de Sectores:** Implementar un menú c numeración de sectores: [01] VAULT, [02] LOGIC, [03] PERSONA, [04] GOVERNANCE.
- [ ] **Header Técnico:** Que el header tenga el componente SystemStats (indicador de RAM y estado de freeLLMAPI) en la esquina superior derecha.

## Fase 2: Especialización de Sectores (Vistas)

- [ ] **Vista "Logic" (Skills):**
  - Crear una barra de **Smart-Filters** con badges: All, Marketing, Dev, Design, Architecture.
  - Diseñar la SkillCard: debe ser más compacta que la de Vault, mostrando el icono del dominio, la versión (v1.2) y un botón de "Copy Command".
- [ ] **Vista "Persona" (Identity Lab):**
  - Diseñar la PersonaCard: similar a una ficha técnica o ID card. Debe incluir un avatar (placeholder para tus logos artísticos), sliders visuales para Temperature y un área de texto para el System Prompt.
- [ ] **Vista "Governance" (The Library):**
  - Implementar un layout de dos columnas: izquierda para un explorador de archivos (.cursorrules, claude.md, etc.) y derecha para un lector de Markdown con resaltado de sintaxis.

## Fase 3: El Laboratorio de Compilación (The Forge)

- [ ] **Layout de 3 Columnas para el Compilador:**
  - Columna 1: Selectores rápidos (Dropdowns estilizados) para elegir Persona, Skill y Rules.
  - Columna 2: **Live Preview Area**. Un panel grande con efecto de "papel cebolla" o transparencias donde se vea el prompt final construyéndose.
  - Columna 3 (Opcional): Panel de configuración de parámetros (Model, Context Window).
- [ ] **Componente TerminalOutput:** Crear la caja de texto donde aparecerá el streaming. Debe tener un cursor parpadeante (\_) y soporte para el efecto de "máquina de escribir".

## Fase 4: Analíticas y Logs (Control Center)

- [ ] **Dashboard de Métricas:** Integrar contenedores para los gráficos de **Recharts**. Uno para Tokens/s (Rendimiento) y otro para Quality Score (Evolución).
- [ ] **Feed de ExecutionLogs:** Crear una lista de historial con scroll infinito. Cada ítem debe mostrar el logo de la Persona usada, el nombre de la Skill y el tiempo de respuesta en milisegundos.
- [ ] **Modal de Inspección:** Diseñar un modal que se abra al clickear un log para comparar el Full Input vs el Output lado a lado.

## Estructura Final del Sidebar

Dividiremos el Sidebar en dos grandes bloques: **Biblioteca** (donde vive el conocimiento) y **Terminal** (donde ocurre la acción y el monitoreo).

| Sección             | Fase   | Propósito                                                               |
| ------------------- | ------ | ----------------------------------------------------------------------- |
| [01] VAULT          | ---    | Repositorio general de ideas y prompts creativos.                       |
| [02] LOGIC          | ---    | Tus Skills, comandos de marketing para Starflow y herramientas de dev.  |
| [03] PERSONA        | ---    | Tus identidades de IA (Arquitectos, Estrategas, etc.).                  |
| [04] GOVERNANCE     | ---    | La "Constitución": reglas .cursorrules, Claude.md y guías éticas.       |
| --- OPERACIONES --- |        |                                                                         |
| [05] THE FORGE      | Fase 3 | El Compilador. Aquí es donde montas el prompt y lo ejecutas.            |
| [06] ACTIVITY       | Fase 4 | Logs e Historial. El feed de todo lo que has generado y su rendimiento. |
| [07] ANALYTICS      | Fase 4 | Métricas. Gráficos de velocidad (TPS) y uso de RAM de freeLLMAPI.           |

## La seccion Governance tendria una organizacion especifica:

un sistema de Ámbitos (Scopes) y Formatos de Salida.

1. Clasificación por "Niveles de Autoridad"En lugar de separar por herramienta (Claude vs Gemini), organizaremos el contenido por a qué nivel afecta la regla:

| Nivel (Subsección)   | Contenido                                                  | Ejemplo de Archivo                       |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| [04.1] PROJECT       | Reglas globales de código y estructura.                    | .cursorrules, coding-standards.md        |
| [04.2] PROTOCOLS     | Guidelines sobre cómo usar las Skills de la sección Logic. | marketing-workflow.md, skill-usage.md    |
| [04.3] BEHAVIOR      | Reglas éticas y de tono para las Personas (White Hat).     | persona-constraints.md, tone-of-voice.md |
| [04.4] TOOL-SPECIFIC | Archivos de configuración técnica para LLMs específicos.   | claude.md, gemini.md, codex.json         |

## 2. La Interfaz: "The Great Library"

La vista de **Governance** debe ser distinta a las tarjetas neón de Vault. Debe priorizar la lectura y la gestión de archivos:

- **Vista de Documento:** Un explorador de archivos lateral (dentro de la sección) que muestra los nombres de los archivos (.cursorrules, claude.md).
- **Editor Markdown Pro:** Al seleccionar un archivo, se abre un editor/lector con resaltado de sintaxis.
- **Smart Copy / Export:**
  - Si es un .cursorrules, el botón dice **"Sync with Root"**.
  - Si es un guideline de Skill, aparece un botón de **"Attach to Logic"** para que cuando uses esa skill, la regla se pegue automáticamente.
  - Si es un archivo para Claude/Gemini, ofrece la descarga directa del archivo .md.

## 3. ¿Cómo se conectan las piezas?

La magia de esta organización es la **Referencia Cruzada**:

1. **En Persona:** Cuando estás viendo la ficha de tu "Estratega White Hat", el sistema te muestra un link a: _"Regido por: Governance > Behavior > White-Hat-Ethics.md"_.
2. **En Logic:** Al usar la skill de "Analizador de Mercado", aparece un aviso: _"Protocolo sugerido: Governance > Protocols > Marketing-Research.md"_.
3. **En el despliegue:** Puedes tener un script que combine automáticamente la Persona + la Skill + las Rules de Governance en un solo mega-prompt final, garantizando que la IA nunca se salga de tus leyes.
