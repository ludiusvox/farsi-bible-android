📖 Farsi Holy Bible: Ultra-Lite Performance Edition
A high-performance, ad-free Farsi (Persian) Bible reader optimized for Android 15, Samsung One UI, and low-latency RAM management.

This application is engineered for extreme readability and instant navigation, stripping away modern web bloat to provide a pure, distraction-free study experience tailored for native Farsi readers.

⚡ Performance & Optimization
The "Ultra-Lite" edition is built for speed, ensuring the UI remains locked at a consistent 120Hz (Samsung ProMotion).

Zero Bloatware: No ads, no tracking scripts, no third-party SDKs, and no monetization pop-ups.

Memory Management: Utilizes a Virtual Scroll Context to keep heap size under 50MB, even during deep study.

Instant Search: Features a linear-time complexity algorithm for instant filtering of all 1,189 chapters without taxing the CPU.

Memoized Data: Core structures are parsed only once to prevent "Garbage Collection" spikes.

📱 Hardware Requirements
[!CAUTION]
Warning: Due to the high-performance memory management and Android 15 architecture, this application will not work on a 4GB phone.

🌍 Farsi Typography & RTL Layout
Designing for Farsi requires specific architectural choices to ensure native readability and cultural accuracy:

Right-to-Left (RTL) Architecture: Farsi is read from right to left. The entire application—from text alignment and page turning to the navigation sidebar and scrollbars—has been horizontally mirrored. This provides a natural, intuitive flow that mimics opening and reading a physical Farsi book.

Enhanced Perso-Arabic Font Sizing: Unlike Latin scripts, Farsi and Arabic scripts rely heavily on intricate ligatures, varying baseline alignments, and critical dot placements that dictate word meaning. To maintain absolute legibility and prevent eye strain, the base font size and line height (leading) are rendered significantly larger than standard English text. This prevents the clipping of tall ascenders and deep descenders common in the script.

🛠 Technical Stack
Language: Java 21 / TypeScript

Framework: React 19 (Ultra-light configuration with RTL support)

Styling: Tailwind CSS 4.0 (Utilizing RTL variants)

Icons: Lucide-React (Tree-shaken, horizontally flipped for RTL context)

🎨 Visuals & Accessibility
Obsidian Dark Mode: Deep OLED Black (oklch(0.145 0 0)) designed to maximize battery life on Super AMOLED displays.

Eye Protection: Off-white typography reduces eye strain and eliminates "Blue Light" halos.

WCAG AAA Compliant: High-contrast ratios for all headers, verse numbers, and diacritics.

Edge-to-Edge: Full utilization of Samsung Infinity-O screens, including punch-hole camera padding.

🔍 Smart Navigation
Tree-View Sidebar: Rapid-access drawer grouped by Book and Chapter, anchored to the right side of the screen.

Dynamic Filtering: "Type-to-Find" functionality that narrows the library as you type Farsi characters.

Scroll-Sync: The sidebar automatically highlights your current chapter as you read.

🔒 Privacy & Offline Use
No Internet Required: Works 100% offline after the initial load.

Silent Companion: Respects all Android 15 privacy and power-saving permissions; no intrusive alerts or notifications.
