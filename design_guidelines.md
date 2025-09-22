# Design Guidelines: Gadang Barubah Interactive Game Interface

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern gaming interfaces like Discord, Genshin Impact's UI, and interactive web games, combined with traditional Indonesian cultural elements to create an engaging, game-like experience.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Background: #3f1113 (dominant dark red as requested)
- UI Accents: 45 25% 85% (warm cream for text/UI elements)
- Interactive Elements: 15 60% 50% (warm gold for buttons/highlights)
- Chat Bubbles: 0 0% 95% (light gray for user messages)
- Uni's Messages: 45 40% 92% (warm beige for mascot responses)

### B. Typography
- Primary Font: 'Poppins' via Google Fonts (modern, friendly, great for gaming UI)
- Secondary Font: 'Inter' for body text and chat content
- Headings: Bold weights (600-700)
- Body text: Regular (400) and Medium (500)

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, h-6, gap-8)
- Consistent 8px grid system
- Generous padding for mobile touch targets
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

### D. Component Library

**Core Components:**
1. **Logo Display**: Positioned top-center with subtle glow animation
2. **Animated Mascot (Uni)**: Center-left positioning with idle animations, traditional Minangkabau attire, expressive facial animations
3. **Game-Style Chatbox**: 
   - Bottom-right corner (desktop) / bottom overlay (mobile)
   - Rounded corners with subtle shadow
   - Type-writer text effects for Uni's messages
   - Sound notification indicators
4. **Interactive Elements**:
   - Glowing buttons with hover states
   - Particle effects for interactions
   - Smooth slide-in animations for chat messages

**Navigation:** Minimal - single page focus with floating UI elements

**Forms:** Simple chat input with send button, emoji support suggested

**Data Displays:** Chat message history with timestamps

**Overlays:** Welcome modal when Uni first greets users

### E. Animations
**Strategic Animation Use:**
- Logo: Subtle breathing glow effect (2-3s cycle)
- Mascot Uni: Idle blinking, occasional wave, bounce when speaking
- Chat: Type-writer effect for incoming messages, slide-up for new messages
- UI: Smooth fade-ins, gentle hover effects on interactive elements
- Background: Optional subtle particle effects or floating elements

## Responsive Design Strategy
- **Desktop (1024px+)**: Full layout with mascot left, chatbox right, logo top-center
- **Tablet (768-1023px)**: Compact layout, smaller mascot, adjusted chatbox position
- **Mobile (< 768px)**: Stacked layout, chatbox overlay, mascot scales appropriately

## Cultural Integration
- Incorporate subtle Minangkabau patterns in UI borders
- Use traditional color inspirations while maintaining modern gaming aesthetic
- Uni's dialogue should reflect friendly Indonesian hospitality

## Images
- **Gadang Barubah Logo**: Top-center placement with responsive scaling
- **Mascot Uni**: Custom illustrated character in traditional Minangkabau attire, positioned center-left on desktop, center-top on mobile
- **No large hero image**: Focus on interactive mascot and clean interface

## Technical Considerations
- Smooth 60fps animations using CSS transforms
- Mobile-first responsive approach
- Touch-friendly interaction zones (minimum 44px)
- Loading states for chat responses
- Accessibility considerations for animations (respect prefers-reduced-motion)