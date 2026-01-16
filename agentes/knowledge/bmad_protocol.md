# BMAD Collaboration Protocol

**Status:** MANDATORY for all agents.
**Purpose:** Define how agents collaborate, validate, and communicate.

## Core Principles

### 1. Dependency Declaration
Every agent must explicitly declare what they need:
- **Input:** What artifacts/documents from upstream agents?
- **Knowledge:** What internal knowledge files must be read?
- **User Input:** What questions must be answered?

### 2. Reflection Before Finalization
Before delivering any artifact, agents MUST:
1. **Read Vibe Manifesto:** Execute the mandatory internal monologue defined in their `vibe_manifesto.md`
2. **Self-Critique:** Review their own work against their mandate
3. **Gap Analysis:** Identify assumptions or missing information
4. **Quality Check:** Verify against their knowledge base standards
5. **Reality Check (if applicable):** For Ricardo (PRD) and Sofia (Architecture), execute the self-correction protocol (Phases 1.5 and 2.5)

### 3. Validation of Upstream Work
When receiving work from another agent:
1. **Completeness Check:** Does it have everything I need?
2. **Challenge Assumptions:** Are there risks or alternatives?
3. **Escalate if Needed:** Flag to Gabriel/User if something is wrong

### 4. Human-in-the-Loop Checkpoints
Agents must pause for user input at:
- **Discovery Phase:** Before writing specs (ask questions)
- **Reference Gathering:** Before designing (request examples)
- **Plan Approval:** Before execution (present unified plan)

## Communication Patterns

### Pattern 1: Sequential Handoff
```
Ricardo → Sofia
Ricardo: "Here's my PRD. I assumed X and Y."
Sofia: "Reviewing... Feature Z is expensive. I propose alternative W."
Gabriel: "User, approve Sofia's proposal?"
```

### Pattern 2: Parallel Collaboration
```
Gabriel → [Sofia + Amanda]
Sofia: "I'll design the database."
Amanda: "I'll design the UI. Sofia, what constraints do I have?"
Sofia: "Max 5 tables for MVP. Use Supabase Auth."
```

### Pattern 3: Reflection Loop
```
Agent (Internal):
1. Generate draft
2. Self-critique: "Did I follow ui_standards.md?"
3. Refine
4. Present to Gabriel
```

### Pattern 4: Reality Check (Self-Correction)
```
Ricardo (Phase 1.5 - PRD Reality Check):
1. Review own PRD with critical lens
2. Checklist: Success metrics? MoSCoW? Clear "Why"? Assumptions documented?
3. Auto-correct if flaws found (max 2 iterations)
4. Escalate to user if still flawed

Sofia (Phase 2.5 - Architecture Reality Check):
1. Security audit of own Inventory
2. Checklist: Inventory exists? RLS policies? Indexed FKs? Appropriate types? Migration mapping?
3. Auto-correct if flaws found (max 2 iterations)
4. Escalate to user if still flawed
```

## Escalation Rules
- **Technical Risk:** Sofia escalates to User via Gabriel
- **Unclear Requirements:** Any agent escalates to Ricardo
- **Design Conflict:** Amanda/Pamela escalate to Gabriel for mediation
