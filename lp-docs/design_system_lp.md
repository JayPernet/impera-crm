# Design System Mirror: CRM Landing Page ("The Portal")

> [!IMPORTANT]
> **DIRETRIZ DE BRANDING:**
> A Landing Page deve ser um espelho fiel do CRM.
> **Identity:** "Cyber-Precision Luxury".
> **Core Concept:** "The Gold & The Ocean" (Ouro da Realeza + Profundidade do Oceano).

---

## 1. Paleta de Cores (Foundation)

O sistema de cores foi extraído diretamente de `globals.css` do CRM. **Não invente cores novas.**

### The Deep (Backgrounds)
- **Abyss (Main BG):** `#0B1215` (Preto profundo, quase vácuo)
- **Petroleo (Surface/Cards):** `#1A2F35` (Verde petróleo escuro, para painéis)
- **Teal Medium (Elevated):** `#243F48` (Para elementos flutuantes)
- **Obsidian (Borders):** `#0F1A1E` (Estrutural)

### The Crown (Primary/Accents)
- **Crown Gold (Primary):** `#FFCD00` (Ouro puro, cirúrgico, de alta visibilidade)
- **Gold Light:** `#FFD733` (Hover state)
- **Gold Dark:** `#CCA400` (Active state/Shadows)
- **Gold Muted:** `rgba(255, 205, 0, 0.12)` (Fundos sutis)

### Semantic Mapping
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#94A3B8` (Prata suave)
- **Text Gold:** `var(--crown-gold)`
- **Border Luxury:** `rgba(255, 205, 0, 0.15)`

---

## 2. Tipografia

- **Font Family:** `Geist Sans` (ou `Inter` se Geist não disponível), `JetBrains Mono` (para dados/código).

### Hierarquia (Landing Page Scale)
A LP exige uma escala tipográfica mais agressiva que o CRM.

- **Hero Headline (H1):** 
  - Size: `clamp(2.5rem, 5vw, 4.5rem)`
  - Weight: `700`
  - Style: `.imperial` (Gradient Gold Text)
  
- **Section Title (H2):**
  - Size: `2.5rem`
  - Color: `var(--text-gold)`
  - Letter-spacing: `-0.02em`

- **Lead Paragraph:**
  - Size: `1.25rem`
  - Color: `var(--text-secondary)`
  - Line-height: `1.6`

---

## 3. Componentes Visuais (Classes Espelhadas)

Utilize estas classes CSS/Tailwind que já existem no CRM.

### Botões
- **.btn-gold:**
  - Background: `linear-gradient(135deg, #FFCD00 0%, #FFD733 100%)`
  - Shadow: `0 4px 12px rgba(255, 205, 0, 0.3)`
  - Text: Dark Navy/Black (Contraste máximo)

- **.btn-outline-gold:**
  - Border: `1.5px solid rgba(255, 205, 0, 0.4)`
  - Background: `rgba(61, 71, 78, 0.4)` (Blur)
  - Text: Gold

### Cards (.luxury-card)
Use para apresentar features.
- **Glassmorphism:** `backdrop-filter: blur(12px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.03)`
- **Hover Effect:** Glow dourado sutil (`box-shadow: 0 0 20px rgba(212, 175, 55, 0.15)`).

---

## 4. Efeitos Especiais (VFX)

### Ambient Studio Lighting
Para a seção Hero, replique o efeito de iluminação do `body::before` do CRM:
- Radial Gradient fixo no topo direito (`top: -20%, right: -15%`).
- Cor: `rgba(255, 205, 0, 0.03)` (Ouro muito sutil).
- Animação: `pulse` (8s loop).

### Imperial Text Gradient
Para palavras-chave de impacto:
```css
.text-imperial {
  background: linear-gradient(135deg, #CCA400 0%, #FFCD00 50%, #FFD733 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 5. Implementação na LP

Recomenda-se importar diretamente o `globals.css` do CRM se a LP estiver no mesmo monorepo, ou copiar as variáveis `:root` para garantir fidelidade 1:1.
