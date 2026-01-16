---
description: "Vibe Code Auto-Orchestrator: From Idea to Execution Plan"
---
# Vibe Code Auto-Orchestrator
This workflow automates the interaction between the specialized agents (Ricardo, Sofia, Amanda, Helena, etc.).
The User's role is strictly **APPROVER**.
## Trigger
User provides a raw **IDÉIA**.
## Phase 1: Strategy & Definition (Agente: 01 - Ricardo)
1.  **Analyze Idea:** Ricardo reads the user's idea.
2.  **Generate Artifacts:**
    - `PRD.md` (Product Requirement Document)
    - `Epics.md`
3.  **USER ACTION:** **Approve** or **Refine** PRD.
    - *If Approved:* Proceed to Phase 1.5.
    - *If Refined:* Ricardo updates PRD. Repeat Step 3.

## Phase 1.5: Reality Check - PRD (Agente: 01 - Ricardo in Devil's Advocate Mode)
1.  **Self-Critique:** Ricardo reviews his own PRD with a critical lens.
2.  **Checklist:**
    - Are success metrics clearly defined?
    - Are features prioritized (MoSCoW)?
    - Is the "Why" clear for each feature?
    - Are assumptions documented?
    - Is the scope realistic?
3.  **Auto-Correction:** If flaws are found, Ricardo rewrites the affected sections.
4.  **Max Iterations:** 2 attempts. If still flawed, escalate to user.
5.  **Proceed to Phase 2.**

## Phase 2: Architecture & Foundation (Agente: 02 - Sofia)
1.  **Read Context:** Sofia reads the approved `PRD.md`.
2.  **Generate Artifacts:**
    - `Inventario_Database.md` (The Source of Truth)
    - `Tech_Architecture.md` (Stack & Security)
3.  **USER ACTION:** **Approve** or **Refine** Architecture.
    - *If Approved:* Proceed to Phase 2.5.
    - *If Refined:* Sofia updates Architecture. Repeat Step 3.

## Phase 2.5: Reality Check - Architecture (Agente: 02 - Sofia in Security Audit Mode)
1.  **Security Audit:** Sofia reviews her own Inventory and Architecture.
2.  **Checklist:**
    - **Does the `inventario_database.md` exist and is it complete?** (BLOCKING)
    - Does it include environment mapping for migration?
    - Does every table have RLS policies?
    - Are foreign keys indexed?
    - Are data types appropriate for scale?
    - Are constraints defined to prevent bad data?
    - Is the architecture modular (sharded if needed)?
3.  **Auto-Correction:** If flaws are found, Sofia rewrites the affected sections.
4.  **Max Iterations:** 2 attempts. If still flawed, escalate to user.
5.  **Proceed to Phase 3.**

## Phase 3: Visual & Experience (Agente: 03 - Amanda & 09 - Pamela)
1.  **Read Context:** Amanda reads `PRD.md` (for flow) and `Tech_Architecture.md` (for constraints).
2.  **Generate Artifacts:**
    - `Spec_Frontend.md` (Visual Blueprints)
    - `Tone_of_Voice.md` (Pamela defines the Brand Voice)
3.  **USER ACTION:** **Approve** or **Refine** Specs.
    - *If Approved:* Proceed to Phase 4.

## Phase 4: Tactical Planning (Agente: 07 - Helena & 08 - Gabriel)
1.  **Read Context:** Helena reads ALL previous artifacts.
2.  **Generate Artifacts:**
    - `PRP_Master_List.md` (The Execution Plan)
    - `Mission_01_PRP.md` (The first actionable prompt for the AI)
3.  **USER ACTION:** **Approve** the Mission Plan.
    - *If Approved:* The project is ready for **EXECUTION** (Marcos/Claudio).
---
## Instructions for the AI (Orchestrator)
- **Do NOT stop** between agents within a phase unless critical info is missing.
- **ALWAYS** present the output of a phase to the user for explicit approval before triggering the next phase.
- **Maintain Context:** Ensure the downstream agent explicitly references the upstream agent's output.
