/**
 * Critical inline CSS – guarantees visible layout and design even when
 * the main stylesheet (Tailwind/globals.css) is delayed or fails to load.
 * Used in root layout and any fallback shell.
 */
export const CRITICAL_CSS = `
:root{
  --color-bg:#fff;--color-bg-elevated:#fafafa;--color-bg-muted:#f5f5f5;
  --color-text:#1a1a1a;--color-text-muted:#545454;--color-text-subtle:#737373;--color-border:#e5e5e5;
  --color-accent-1:#e65100;--color-accent-1-muted:rgba(230,81,0,0.12);
  --color-accent-2:#0097a7;--color-accent-2-muted:rgba(0,151,167,0.12);
  --color-hero-bg:#f5f5f7;--color-hero-text:#1a1a1a;--color-hero-text-muted:#545454;
  --font-primary:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;
}
.dark{
  --color-bg:#0c0c0e;--color-bg-elevated:#141416;--color-bg-muted:#1a1a1d;
  --color-text:#fafafa;--color-text-muted:#a3a3a3;--color-border:rgba(255,255,255,0.08);
  --color-accent-1:#ff833a;--color-accent-1-muted:rgba(255,131,58,0.15);
  --color-hero-bg:#0c0c0e;--color-hero-text:#fafafa;--color-hero-text-muted:rgba(250,250,250,0.7);
}
html{background:var(--color-hero-bg);scroll-behavior:smooth;}
body{background:var(--color-bg);color:var(--color-text);font-family:var(--font-primary);margin:0;min-height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased;}
body main{flex:1 1 auto;}
.flex{display:flex;}.flex-col{flex-direction:column;}.flex-1{flex:1 1 auto;}.min-h-screen{min-height:100vh;}
.flex-wrap{flex-wrap:wrap;}.items-center{align-items:center;}.justify-center{justify-content:center;}.gap-4{gap:1rem;}.gap-6{gap:1.5rem;}.gap-8{gap:2rem;}
.relative{position:relative;}.overflow-hidden{overflow:hidden;}.z-10{z-index:10;}
.container-tight{max-width:72rem;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;}
@media(min-width:640px){.container-tight{padding-left:1.5rem;padding-right:1.5rem;}}
@media(min-width:1024px){.container-tight{padding-left:2rem;padding-right:2rem;}}
.container-wide{max-width:80rem;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;}
.section-padding{padding-top:4rem;padding-bottom:4rem;}
@media(min-width:768px){.section-padding{padding-top:5rem;padding-bottom:5rem;}}
@media(min-width:1024px){.section-padding{padding-top:6rem;padding-bottom:6rem;}}
.display-1{font-size:clamp(2.25rem,5vw,4.5rem);font-weight:700;letter-spacing:-0.03em;line-height:1.05;}
.display-2{font-size:clamp(1.875rem,4vw,3.75rem);font-weight:700;letter-spacing:-0.03em;}
.display-3{font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;}
.prose-lead{font-size:1.125rem;line-height:1.7;color:var(--color-text-muted);}
.section-label{color:var(--color-accent-1);font-size:0.75rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;}
.grid{display:grid;}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr));}
@media(min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr));}}
.p-4{padding:1rem;}.p-6{padding:1.5rem;}.p-8{padding:2rem;}
.mb-4{margin-bottom:1rem;}.mb-6{margin-bottom:1.5rem;}.mb-8{margin-bottom:2rem;}
.text-center{text-align:center;}
.rounded-2xl{border-radius:1rem;}.rounded-3xl{border-radius:1.5rem;}
.border{border-width:1px;border-style:solid;border-color:var(--color-border);}
@keyframes spin{to{transform:rotate(360deg);}}
.animate-spin{animation:spin 1s linear infinite;}
`.replace(/\n/g, ' ').trim();
