@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;750;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;0,800;1,400&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer utilities {
  .font-serif {
    font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif;
  }
  .font-script {
    font-family: 'Great Vibes', cursive, ui-serif;
  }
}

/* ========================================================== */
/* 🖨️ LANDSCAPE HIGH-RESOLUTION MEDIA PRINT STYLES            */
/* ========================================================== */
@media print {
  /* Hide all non-certificate content */
  body * {
    visibility: hidden;
  }
  
  /* Show only the target frame and its internal components */
  #certificate-frame, #certificate-frame * {
    visibility: visible;
  }

  /* Position framework absolute at 0,0 full-page landscape fill */
  #certificate-frame {
    visibility: visible;
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 2.5rem !important;
    border-width: 16px !important;
    border-radius: 0px !important;
    box-shadow: none !important;
    background-color: #ffffff !important;
    background-image: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(253, 251, 245, 0.98) 100%) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    page-break-inside: avoid !important;
  }

  /* Set page orientation landscape with small margins */
  @page {
    size: landscape;
    margin: 0.5cm;
  }
}
