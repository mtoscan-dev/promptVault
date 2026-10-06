## La Arquitectura de la Forja (3 Paneles Centrales)

En lugar de la tarjeta central estática que tienes ahora, este espacio debería dividirse en un layout de tres columnas (o paneles) que se sientan como una **orquestación de contexto**.  
**1. Panel de Ingredientes (Izquierda)**  
Aquí es donde seleccionas las piezas que has guardado en los otros sectores del HUD:

- **Selector de Persona:** Un dropdown o lista rápida con tus identidades de IA (ej: _Patagonia Architect_).
- **Selector de Skills (Logic):** Donde activas la lógica técnica, como los comandos de **Claude Code** o estrategias para **Starflow**.
- **Selector de Governance:** Interruptores rápidos para activar reglas de cumplimiento o estilos de escritura (ej: _White Hat Mode_).  
  **2. Área de Ensamblaje (Centro)**  
  Este es el corazón de la pantalla. Debe ser un editor de texto dinámico:
- **Input del Usuario:** Un campo de texto simple para tu petición actual.
- **Live Blueprint:** Justo debajo, un panel de "solo lectura" que muestra cómo se está construyendo el **Mega-Prompt** en tiempo real.  
   \* _Tip:_ Usa colores sutiles para diferenciar qué parte viene de la Persona (Cian), qué parte de la Skill (Ámbar) y qué parte de las reglas (Magenta).  
  **3. Terminal de Salida (Derecha)**  
  Aquí es donde el compilador "escupe" el resultado:
- **Streaming de freeLLMAPI:** Un área negra de terminal donde el texto aparece mediante streaming.
- **Métricas de Inferencia:** Debajo del texto, pequeños indicadores de _Tokens por segundo_ (TPS) y _Tiempo de Generación_, para que sepas exactamente cuánto esfuerzo le costó a tu hardware local.

## El "Bunker Mode" (Tu HUD interactivo)

Dado que ya tienes el HUD con la RAM y el CPU arriba, **The Forge** debe ser la sección que "estresa" esos indicadores.  
**Idea Pro:** Cuando presiones el botón de **"COMPILE & EXECUTE"**, la tarjeta central podría tener una animación de "carga de energía" (un pulso rojo o naranja) que coincida con el aumento de uso de CPU que verás en tu HUD.

## Estado de la UI según tu imagen

- **FORGE_MODE: COOLING** es un gran detalle estético. Podrías hacer que cambie a **FORGE_MODE: HEATING** o **PROCESSING** cuando la IA esté trabajando.
- **COMPILER: IDLE** cambiaría a **COMPILER: STREAMING** cuando recibas los datos de freeLLMAPI.

## Idea de implementacion del workspace de la seccion Forge

ForgeWorkspace.tsx

```typescript
'use client';
import React, { useState } from 'react';
import {
  UserCircle2, Zap, ShieldCheck, Terminal,
  Play, Cpu, Activity, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ForgeWorkspace = () => {
  const [isCompiling, setIsCompiling] = useState(false);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full gap-4 p-4 font-mono text-xs">

      {/* 1. PANEL DE INGREDIENTES (IZQUIERDA) */}
      <aside className="w-1/4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        <section className="bg-black/40 border border-white/5 p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-4 text-cyan-500">
            <UserCircle2 size={16} />
            <span className="uppercase tracking-widest font-bold text-[10px]">Active_Persona</span>
          </div>
          {/* Aquí mapearás tus Personas de la DB */}
          <div className="space-y-2">
            <button className="w-full text-left p-2 border border-cyan-500/20 bg-cyan-500/5 text-cyan-100/70 hover:bg-cyan-500/10 transition-all">
              Patagonia Architect v1.0
            </button>
          </div>
        </section>

        <section className="bg-black/40 border border-white/5 p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-500">
            <Zap size={16} />
            <span className="uppercase tracking-widest font-bold text-[10px]">Logic_Skills</span>
          </div>
          {/* Aquí mapearás tus Skills (Claude Code, etc) */}
          <div className="space-y-2">
            <button className="w-full text-left p-2 border border-amber-500/10 text-amber-100/40 hover:text-amber-100 hover:border-amber-500/30 transition-all">
              NextJS_RAM_Optimizer
            </button>
          </div>
        </section>

        <section className="bg-black/40 border border-white/5 p-4 rounded-sm flex-1">
          <div className="flex items-center gap-2 mb-4 text-fuchsia-500">
            <ShieldCheck size={16} />
            <span className="uppercase tracking-widest font-bold text-[10px]">Governance_Rules</span>
          </div>
          {/* Aquí mapearás tus reglas de cumplimiento */}
          <div className="space-y-3 opacity-50">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" className="accent-fuchsia-500" /> White_Hat_Standard
            </label>
          </div>
        </section>
      </aside>

      {/* 2. ÁREA DE ENSAMBLAJE (CENTRO) */}
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-black/60 border border-white/10 rounded-sm relative flex flex-col">
          <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/5">
            <span className="text-white/40 flex items-center gap-2">
              <Sparkles size={14} /> LIVE_BLUEPRINT
            </span>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-500/70 uppercase">Ready_to_Compile</span>
            </div>
          </div>

          <textarea
            placeholder="Introduce tu requerimiento operativo..."
            className="flex-1 bg-transparent p-6 outline-none resize-none text-sm text-white/80 placeholder:text-white/10 font-sans"
          />

          <div className="p-4 border-t border-white/5 bg-black/40">
            <button
              onClick={() => setIsCompiling(true)}
              className="w-full py-3 bg-white/5 border border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group"
            >
              <Play size={16} className="group-hover:fill-black" />
              <span className="font-bold tracking-[0.3em] uppercase">Execute_Inference</span>
            </button>
          </div>
        </div>
      </main>

      {/* 3. TERMINAL DE SALIDA (DERECHA) */}
      <aside className="w-1/3 bg-black border-l border-white/10 flex flex-col">
        <div className="p-3 border-b border-white/5 flex items-center gap-2 text-white/30 uppercase text-[10px] tracking-widest">
          <Terminal size={14} /> Output_Stream
        </div>

        <div className="flex-1 p-6 text-emerald-500/90 leading-relaxed overflow-y-auto custom-scrollbar italic font-serif">
          {/* Aquí se renderizará el streaming de freeLLMAPI */}
          {"> Waiting for operation..."}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] text-white/20 uppercase block">Inference_Speed</span>
            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <Cpu size={12} /> 12.4 TPS
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-white/20 uppercase block">Latency</span>
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <Activity size={12} /> 140ms
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
};
```
