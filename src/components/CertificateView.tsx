import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, Share2, Copy, Send, Download, Phone, AlertCircle, ArrowLeft, 
  Printer, Check, Facebook, Twitter, ShieldCheck, Mail, Sparkles, X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate } from '../types';
import { executeHtml2CanvasWithOklchPatch } from '../utils/oklchPatch';

interface CertificateViewProps {
  certificate: Certificate;
  onNavigate: (route: string) => void;
}

export default function CertificateView({ certificate, onNavigate }: CertificateViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [showSaveCenter, setShowSaveCenter] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedPdf, setCapturedPdf] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (capturedPdf) {
        URL.revokeObjectURL(capturedPdf);
      }
    };
  }, [capturedPdf]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const triggerBlobDownload = (base64Data: string, filename: string) => {
    try {
      const byteString = atob(base64Data.split(',')[1]);
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      return true;
    } catch (e) {
      console.error("Blob download failed", e);
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        if (parentWidth > 0) {
          const newScale = Math.min(1, parentWidth / 1000);
          setScale(newScale);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Fallback delays to handle layout settled sizes
    const t1 = setTimeout(handleResize, 100);
    const t2 = setTimeout(handleResize, 500);
    const t3 = setTimeout(handleResize, 1500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [certificate]);

  // Separate premium designs mapping for Gold, Silver, Bronze, and Participation
  const medalThemes = {
    gold: {
      borderClass: 'border-amber-500 bg-amber-50/20',
      borderColorHex: '#d97706',
      badgeTitle: 'GOLD MEDAL ACHIEVER',
      badgeSubtitle: 'Curriculum Master Excellence',
      backgroundGradient: 'from-amber-50 via-yellow-100/30 to-amber-50/20',
      sealColor: 'border-amber-500 text-amber-600 bg-amber-50',
      ribbonColor: 'bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-600',
      medalIcon: (
        <svg className="w-16 h-16 text-amber-500 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#goldGrad)" className="stroke-[2] stroke-amber-600" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#fef3c7" strokeWidth="2" strokeDasharray="4 2" />
          {/* Embossed star and ribbon */}
          <path d="M50 25 L55 38 L68 38 L57 46 L61 59 L50 51 L39 59 L43 46 L32 38 L45 38 Z" fill="#ffffff" />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      ),
      borderDecoration: (
        <div className="absolute inset-4 border-2 border-double border-amber-600/40 rounded-2xl pointer-events-none"></div>
      )
    },
    silver: {
      borderClass: 'border-slate-400 bg-slate-50/20',
      borderColorHex: '#94a3b8',
      badgeTitle: 'SILVER MEDAL ACHIEVER',
      badgeSubtitle: 'Curriculum Honors Distinction',
      backgroundGradient: 'from-slate-50 via-zinc-100/30 to-slate-50/20',
      sealColor: 'border-slate-400 text-slate-500 bg-slate-50',
      ribbonColor: 'bg-gradient-to-b from-slate-400 via-zinc-300 to-slate-500',
      medalIcon: (
        <svg className="w-16 h-16 text-slate-400 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#silverGrad)" className="stroke-[2] stroke-slate-500" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 2" />
          {/* Embossed badge */}
          <path d="M50 26 L55 39 L68 39 L57 47 L61 60 L50 52 L39 60 L43 47 L32 39 L45 39 Z" fill="#ffffff" />
          <defs>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
        </svg>
      ),
      borderDecoration: (
        <div className="absolute inset-4 border-2 border-dashed border-slate-400/40 rounded-2xl pointer-events-none"></div>
      )
    },
    bronze: {
      borderClass: 'border-amber-700 bg-amber-50/10',
      borderColorHex: '#c2410c',
      badgeTitle: 'BRONZE MEDAL ACHIEVER',
      badgeSubtitle: 'Academic Syllabus Merit',
      backgroundGradient: 'from-stone-50 via-orange-100/20 to-stone-50/10',
      sealColor: 'border-orange-600 text-orange-700 bg-orange-50',
      ribbonColor: 'bg-gradient-to-b from-orange-600 via-amber-600 to-orange-850',
      medalIcon: (
        <svg className="w-16 h-16 text-orange-700 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#bronzeGrad)" className="stroke-[2] stroke-orange-800" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#ffedd5" strokeWidth="2" strokeDasharray="4 2" />
          {/* Trophy design inside */}
          <path d="M50 28 L53 38 L64 38 L55 45 L58 56 L50 49 L42 56 L45 45 L36 38 L47 38 Z" fill="#ffffff" />
          <defs>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
          </defs>
        </svg>
      ),
      borderDecoration: (
        <div className="absolute inset-4 border border-orange-700/30 rounded-2xl pointer-events-none"></div>
      )
    },
    participation: {
      borderClass: 'border-indigo-800 bg-indigo-50/5',
      borderColorHex: '#3730a3',
      badgeTitle: 'ACTIVE PARTICIPANT CREDENTIAL',
      badgeSubtitle: 'Class Curriculum Assessment Stamped',
      backgroundGradient: 'from-slate-50 via-indigo-50/20 to-slate-50/10',
      sealColor: 'border-indigo-600 text-indigo-700 bg-indigo-50',
      ribbonColor: 'bg-gradient-to-b from-indigo-700 via-indigo-500 to-slate-900',
      medalIcon: (
        <svg className="w-16 h-16 text-indigo-600 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#partGrad)" className="stroke-[2] stroke-indigo-800" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#e0e7ff" strokeWidth="2" strokeDasharray="4 2" />
          {/* Open book inside */}
          <path d="M36 40 H46 V55 H36 Z M54 40 H64 V55 H54 Z M48 42 H52 V53 H48 Z" fill="#ffffff" />
          <defs>
            <linearGradient id="partGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
        </svg>
      ),
      borderDecoration: (
        <div className="absolute inset-4 border border-indigo-800/25 rounded-2xl pointer-events-none"></div>
      )
    }
  };

  const activeTheme = medalThemes[certificate.medal] || medalThemes.participation;

  const certificateUrl = `https://www.iq200olympiad.org/certificate/${certificate.id}`;
  const shareStatement = `${certificate.studentName} earned a ${certificate.medal.charAt(0).toUpperCase() + certificate.medal.slice(1)} Medal on IQ200 Olympiad.\nScore: ${certificate.score}/${certificate.totalQuestions || 10}\nVerify Certificate:\n${certificateUrl}\nPractice Olympiad Tests:\nhttps://www.iq200olympiad.org`;

  const handleCopyVerificationStatement = () => {
    navigator.clipboard.writeText(shareStatement);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyCertificateLink = () => {
    navigator.clipboard.writeText(certificateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGenerateSaveElements = async () => {
    if (isGeneratingImage) return null;
    setIsGeneratingImage(true);
    const captureElement = document.getElementById('certificate-export-area');
    if (!captureElement) {
      alert('Certificate layout engine not found.');
      setIsGeneratingImage(false);
      return null;
    }

    try {
      // 1. Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      
      // 2. Wait for images to load
      const images = Array.from(captureElement.getElementsByTagName('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // 3. Layout stabilization delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await executeHtml2CanvasWithOklchPatch(captureElement, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc, clonedEl) => {
           // ensure the clone element has no strange positioning that could clip it
           clonedEl.style.position = 'relative';
           clonedEl.style.left = '0px';
           clonedEl.style.top = '0px';
           clonedEl.style.transform = 'none';
        }
      });
      
      const imageUri = canvas.toDataURL('image/png');
      setCapturedImage(imageUri);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate aspect ratio specifically for A4 format
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (700 * pdfWidth) / 1000;
      const yOffset = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
      
      pdf.addImage(imageUri, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      if (capturedPdf) {
        URL.revokeObjectURL(capturedPdf);
      }
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setCapturedPdf(pdfUrl);
      
      return { imageUri, pdfUrl };
    } catch (err) {
      console.error('Failed to pre-generate certificate assets:', err);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    let assets = { imageUri: capturedImage, pdfUrl: capturedPdf };
    if (!assets.imageUri || !assets.pdfUrl) {
      const generated = await handleGenerateSaveElements();
      if (generated) {
        assets = generated;
      }
    }
    
    if (assets.imageUri) {
      setShowSaveCenter(true);
      const filename = `IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.png`;
      triggerBlobDownload(assets.imageUri, filename);
    } else {
      alert('We had trouble creating your certificate image capture. Please try print fallback.');
    }
  };

  const handleDownloadPDF = async () => {
    let assets = { imageUri: capturedImage, pdfUrl: capturedPdf };
    if (!assets.imageUri || !assets.pdfUrl) {
      const generated = await handleGenerateSaveElements();
      if (generated) {
        assets = generated;
      }
    }
    
    if (assets.pdfUrl) {
      setShowSaveCenter(true);
      const filename = `IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.pdf`;
      // Direct click-like blob URL download to bypass restrictions
      const link = document.createElement('a');
      link.href = assets.pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (assets.imageUri) {
      console.warn('PDF generation failed, falling back to PNG export');
      handleDownloadImage();
    } else {
      console.error('Failed to capture certificate pdf, redirecting to print iframe');
      handleTriggerPrint();
    }
  };

  const handleSystemShareImage = async () => {
    const assets = await handleGenerateSaveElements();
    if (!assets || !assets.imageUri) {
      alert('Certificate layout engine not found or failed.');
      return;
    }

    try {
      const filename = `IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.png`;
      
      if (typeof navigator !== 'undefined' && navigator.share) {
        const res = await fetch(assets.imageUri);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `IQ200 Achievement - ${certificate.studentName}`,
            text: `${shareStatement}\nVerify here: ${certificateUrl}`
          });
        } else {
          await navigator.share({
            title: `IQ200 Achievement - ${certificate.studentName}`,
            text: `${shareStatement}\nVerify here: ${certificateUrl}`
          });
        }
      } else {
        navigator.clipboard.writeText(certificateUrl);
        triggerBlobDownload(assets.imageUri, filename);
        alert("Verification link copied to clipboard and PNG downloaded! Direct device sharing isn't supported on this browser.");
      }
    } catch (err) {
      console.warn("Share image native action failed:", err);
    }
  };

  const handleSystemSharePDF = async () => {
    const assets = await handleGenerateSaveElements();
    if (!assets || !assets.pdfUrl) {
      alert('Certificate layout engine not found or failed.');
      return;
    }

    try {
      const filename = `IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.pdf`;
      const res = await fetch(assets.pdfUrl);
      const pdfBlob = await res.blob();
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (typeof navigator !== 'undefined' && navigator.share) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `IQ200 Achievement PDF - ${certificate.studentName}`,
            text: `Here is my verified high-merit PDF certificate of achievement from IQ200 Olympiad. Verify at: ${certificateUrl}`
          });
        } else {
          await navigator.share({
            title: `IQ200 Achievement PDF - ${certificate.studentName}`,
            text: `${shareStatement}\nVerify here: ${certificateUrl}`
          });
        }
      } else {
        navigator.clipboard.writeText(certificateUrl);
        const link = document.createElement('a');
        link.href = assets.pdfUrl;
        link.download = filename;
        link.click();
        alert("Verification link copied to clipboard and PDF saved! Direct device sharing isn't supported on this browser.");
      }
    } catch (err) {
      console.warn("Share PDF native action failed:", err);
    }
  };

  const handleSystemShare = async () => {
    await handleSystemShareImage();
  };

  const shareWhatsApp = () => {
    setIsWhatsAppModalOpen(true);
  };

  const handleLaunchWhatsApp = () => {
    // Copy verified achievement statement
    navigator.clipboard.writeText(shareStatement);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2500);
    
    // Launch WhatsApp
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(certificateUrl)}&text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const handleTriggerPrint = async () => {
    const assets = await handleGenerateSaveElements();
    if (!assets || !assets.imageUri) {
      window.print();
      return;
    }

    try {
      // Create high-fidelity isolated virtual iframe print handler
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.zIndex = '-9999';
      iframe.id = 'certificate-print-iframe';

      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Student Certificate</title>
              <style>
                @page {
                  size: landscape;
                  margin: 0;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  background-color: #ffffff;
                }
                body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-sizing: border-box;
                }
                img {
                  width: 100vw;
                  height: 100vh;
                  object-fit: contain;
                  page-break-inside: avoid;
                }
              </style>
            </head>
            <body>
              <img src="${assets.imageUri}" onload="setTimeout(function() { window.print(); }, 250);" />
            </body>
          </html>
        `);
        iframeDoc.close();

        // Safe delay cleanup
        setTimeout(() => {
          if (document.getElementById('certificate-print-iframe')) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Isolated PDF rendering fallback:', err);
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. TOP UTILITY ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 text-left">
        <button
          onClick={() => onNavigate('#home')}
          className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> 
          <span>Return to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-slate-200 select-all">
            Credential ID: {certificate.uniqueId || `CERT-${certificate.id.substring(0, 8)}`}
          </span>
          
          <button
            onClick={handleTriggerPrint}
            className="bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer leading-none font-sans"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Hidden high-fidelity off-screen capture layout for PDF and PNG downloads */}
      <div 
        style={{ position: 'absolute', left: '-9999px', top: '0px', width: '1000px', height: '700px', zIndex: -9999, pointerEvents: 'none' }}
      >
        <div 
          id="certificate-export-area" 
          className={`border-[16px] rounded-2xl px-14 py-11 text-center flex flex-col justify-between absolute overflow-hidden select-none ${activeTheme.borderClass}`}
          style={{
            width: '1000px',
            height: '700px',
            left: '0px',
            top: '0px',
            backgroundColor: '#ffffff', // Required by instructions
            backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.96) 0%, rgba(253, 251, 245, 0.99) 100%)`,
          }}
        >
          {/* Decorative Corner Filigree elements */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 rounded-br-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>

          {activeTheme.borderDecoration}

          {/* Institutional Header */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-center items-center gap-3">
              <span className="text-3xl filter drop-shadow">🏛️</span>
              <div className="text-left leading-none font-sans">
                <span className="text-xs font-black tracking-widest text-slate-500 block">IQ200 NATIONAL OLYMPIAD ACADEMY</span>
                <span className="text-[10px] font-extrabold text-slate-400 block tracking-widest uppercase mt-0.5">Registered Academic Evaluation Core</span>
              </div>
            </div>
            
            <div className="h-0.5 w-1/3 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto"></div>

            <h2 className="text-4xl h-fit font-serif font-black tracking-tight text-slate-900 uppercase pt-2">
              Certificate of Achievement
            </h2>
            <p className="text-xs text-slate-500 font-semibold italic mt-1 leading-none">
              This digital certificate validates completing the specified subject practice exercises.
            </p>
          </div>

          {/* Candidate core detail section */}
          <div className="my-6 space-y-4 relative z-10">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-sans">THIS CREDENTIAL PROUDLY DECORATES</span>
            
            <h3 className="text-4xl font-serif font-black text-indigo-950 underline decoration-indigo-600 decoration-double underline-offset-8 uppercase py-2">
              {certificate.studentName}
            </h3>

            <p className="text-sm text-slate-650 max-w-2.5xl mx-auto leading-relaxed font-semibold">
              For completing curriculum practice exercises mapped to standard grade-specific learning syllabi frameworks. Commendable metrics established on <span className="text-slate-900 font-extrabold">{certificate.date}</span>, validating the standard grade of <span className="text-indigo-900 font-extrabold bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">{certificate.classLevel}</span> in the active subject of <span className="text-slate-900 font-extrabold underline whitespace-nowrap">{certificate.subject}</span> with an outstanding practice result:
            </p>

            {/* Score/Grade metrics line badge representation */}
            <div className="inline-flex items-center gap-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl px-7 py-3 shadow border border-indigo-500/20 mx-auto select-none font-sans">
              <span className="text-[11px] font-black tracking-widest text-indigo-300 uppercase">{activeTheme.badgeTitle}</span>
              <div className="h-5 w-px bg-indigo-400/30"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-indigo-200 font-bold">SCORE:</span>
                <span className="text-sm font-black text-amber-400 tracking-tight">{certificate.score} / {certificate.totalQuestions || 10}</span>
              </div>
              <div className="h-5 w-px bg-indigo-400/30"></div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-indigo-200 font-bold font-sans">RESULT:</span>
                <span className="text-xs font-black text-emerald-400 font-sans">PASSED</span>
              </div>
            </div>
          </div>

          {/* Certificate Footer: Seal, handwriting signatures, QR Dynamic verification */}
          <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200/80 relative z-10 text-left">
            
            {/* Signature Area Left */}
            <div className="flex flex-col items-start space-y-1.5 text-left leading-none animate-none">
              <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">
                Academy Assessor
              </span>
              <div className="w-40 border-b border-slate-300 my-0.5"></div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">IQ200 Evaluation Lead</span>
            </div>

            {/* Dynamic Gold Seal Center */}
            <div className="flex flex-col items-center justify-center relative mt-4">
              <div className="relative flex items-center justify-center select-none">
                {/* Ribbon graphic backgrounds */}
                <div className="absolute w-5 h-20 bg-amber-500 transform -rotate-12 translate-y-6 shadow-sm rounded-b"></div>
                <div className="absolute w-5 h-20 bg-amber-600 transform rotate-12 translate-y-6 shadow-sm rounded-b"></div>
                
                {/* Micro outer medal borders */}
                <div className={`w-20 h-20 rounded-full border-[3px] flex items-center justify-center shadow-lg relative z-15 ${activeTheme.sealColor}`}>
                  {activeTheme.medalIcon}
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center justify-center opacity-70">
                <span className="text-[6px] font-semibold text-slate-400 font-sans tracking-widest uppercase text-center w-[200px] leading-tight">
                  Certificate authenticated and issued through the official IQ200 Olympiad verification system.
                </span>
                <span className="text-[7px] font-bold text-slate-500 font-mono mt-1">
                  www.iq200olympiad.org
                </span>
              </div>
            </div>

            {/* Verification Right */}
            <div className="flex flex-col items-end space-y-1.5 text-right leading-none">
              
              <div className="flex gap-2 items-center text-left">
                {/* QR Code Graphic element */}
                <div className="p-1 bg-white border border-slate-200/80 rounded shadow-sm text-slate-800 flex items-center justify-center">
                  <QRCodeSVG value={certificateUrl} size={40} />
                </div>

                <div className="text-[8px] font-semibold text-slate-400 space-y-0.5">
                  <span className="font-extrabold uppercase tracking-wide text-indigo-900 block font-sans">Dynamic Verification</span>
                  <p className="font-sans">Scan with smartphone to confirm via Official Certificate Verification Portal.</p>
                  <span className="text-indigo-600 font-bold font-sans flex items-center gap-0.5">
                    www.iq200olympiad.org
                  </span>
                </div>
              </div>

              {/* Regional Standards Registrar Signature */}
              <div className="flex flex-col items-end pt-1">
                <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none leading-none">
                  Curriculum Committee
                </span>
                <div className="w-40 border-b border-slate-300 my-0.5"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Director of Curriculum Standards</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 2. DYNAMIC STYLED PREMIUM CERTIFICATE BODY CONTAINER */}
      <div className="relative bg-slate-50 p-1 rounded-3xl border border-slate-250 shadow-2xl flex items-center justify-start overflow-hidden mx-auto max-w-full" ref={containerRef} style={{ height: `${700 * scale}px`, width: '100% ' }}>
        <div 
          id="certificate-frame" 
          className={`border-[16px] rounded-2xl px-14 py-11 text-center flex flex-col justify-between absolute overflow-hidden select-none ${activeTheme.borderClass}`}
          style={{
            width: '1000px',
            height: '700px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            left: `${Math.max(0, ((containerRef.current?.clientWidth || 1000) - 1000 * scale) / 2)}px`,
            top: '0px',
            backgroundColor: '#fffdf9', // High density solid color fallback
            backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.96) 0%, rgba(253, 251, 245, 0.99) 100%)`,
          }}
        >
          {/* Decorative Corner Filigree elements */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 rounded-br-xl pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>

          {activeTheme.borderDecoration}

          {/* Institutional Header */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-center items-center gap-3">
              <span className="text-3xl filter drop-shadow">🏛️</span>
              <div className="text-left leading-none font-sans">
                <span className="text-xs font-black tracking-widest text-slate-500 block">IQ200 NATIONAL OLYMPIAD ACADEMY</span>
                <span className="text-[10px] font-extrabold text-slate-400 block tracking-widest uppercase mt-0.5">Registered Academic Evaluation Core</span>
              </div>
            </div>
            
            <div className="h-0.5 w-1/3 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto"></div>

            <h2 className="text-4xl h-fit font-serif font-black tracking-tight text-slate-900 uppercase pt-2">
              Certificate of Achievement
            </h2>
            <p className="text-xs text-slate-500 font-semibold italic mt-1 leading-none">
              This digital certificate validates completing the specified subject practice exercises.
            </p>
          </div>

          {/* Candidate core detail section */}
          <div className="my-6 space-y-4 relative z-10">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-sans">THIS CREDENTIAL PROUDLY DECORATES</span>
            
            <h3 className="text-4xl font-serif font-black text-indigo-950 underline decoration-indigo-600 decoration-double underline-offset-8 uppercase py-2">
              {certificate.studentName}
            </h3>

            <p className="text-sm text-slate-650 max-w-2.5xl mx-auto leading-relaxed font-semibold">
              For completing curriculum practice exercises mapped to standard grade-specific learning syllabi frameworks. Commendable metrics established on <span className="text-slate-900 font-extrabold">{certificate.date}</span>, validating the standard grade of <span className="text-indigo-900 font-extrabold bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">{certificate.classLevel}</span> in the active subject of <span className="text-slate-900 font-extrabold underline whitespace-nowrap">{certificate.subject}</span> with an outstanding practice result:
            </p>

            <div className="flex justify-center py-1">
              <span className="bg-slate-900 border border-slate-800 text-amber-400 text-xs font-mono font-black px-4 py-1.5 rounded-lg select-none">
                Score Rank: {certificate.score} / {certificate.totalQuestions || 10} Correct Responses ({Math.round((certificate.score / (certificate.totalQuestions || 10)) * 100)}%)
              </span>
            </div>
          </div>

          {/* Certificate Footer: Seal, handwriting signatures, QR Dynamic verification */}
          <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200/80 relative z-10 text-left">
            
            {/* Signature Area Left */}
            <div className="flex flex-col items-start space-y-1.5 text-left leading-none animate-none">
              <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">
                Academy Assessor
              </span>
              <div className="w-40 border-b border-slate-300 my-0.5"></div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">IQ200 Evaluation Lead</span>
            </div>

            {/* Central Seal decoration */}
            <div className="flex flex-col items-center justify-center space-y-1 text-center leading-none mt-2">
              <div className="flex items-center justify-center">
                {activeTheme.medalIcon}
              </div>
              <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest mt-1.5">
                {activeTheme.badgeTitle}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                {activeTheme.badgeSubtitle}
              </span>
              <div className="mt-6 flex flex-col items-center justify-center opacity-70">
                <span className="text-[6px] font-semibold text-slate-400 font-sans tracking-widest uppercase text-center w-[200px] leading-snug">
                  Certificate authenticated and issued through the official IQ200 Olympiad verification system.
                </span>
                <span className="text-[7px] font-bold text-slate-500 font-mono mt-1">
                  www.iq200olympiad.org
                </span>
              </div>
            </div>

            {/* Verification Right */}
            <div className="flex flex-col items-end space-y-1.5 text-right leading-none">
              
              <div className="flex gap-2 items-center text-left">
                {/* QR Code Graphic element */}
                <div className="bg-white p-1 border border-slate-200 rounded-lg shrink-0 select-none flex items-center justify-center">
                  <QRCodeSVG value={certificateUrl} size={56} />
                </div>

                <div className="text-[8px] font-semibold text-slate-400 space-y-0.5">
                  <span className="font-extrabold uppercase tracking-wide text-indigo-900 block font-sans">Dynamic Verification</span>
                  <p className="font-sans">Scan with smartphone to confirm via Official Certificate Verification Portal.</p>
                  <span className="text-indigo-600 font-bold font-sans flex items-center gap-0.5">
                    www.iq200olympiad.org
                  </span>
                </div>
              </div>

              {/* Regional Standards Registrar Signature */}
              <div className="flex flex-col items-end pt-1">
                <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none leading-none">
                  Curriculum Committee
                </span>
                <div className="w-40 border-b border-slate-300 my-0.5"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Director of Curriculum Standards</span>
              </div>

            </div>

          </div>

        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-left space-y-6 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Social Acceleration & Viral Sharing loop
          </h4>
          <p className="text-xs text-slate-500 font-semibold">
            One-click dispatching to social networks to showcase achievements, motivate study goals, or invite classmates to challenge your high score card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Quick verification text template copy card */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono block">Dynamic Verification Statement</span>
              <p className="text-slate-600 italic font-semibold leading-relaxed border-l-2 border-indigo-5050 pl-2.5">
                "{shareStatement}"
              </p>
            </div>
            
            <button
              onClick={handleCopyVerificationStatement}
              className="w-full mt-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Statement Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-700" />
                  <span>Copy Statement Text</span>
                </>
              )}
            </button>
          </div>

          {/* Social Channels CTA Grid */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono block">Post to Channels</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* WhatsApp */}
              <button
                onClick={shareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Share to WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareFacebook}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
                <span>Share to Facebook</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={shareTwitter}
                className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
                <span>Share to X</span>
              </button>

              {/* Download PDF via jsPDF */}
              <button
                onClick={handleDownloadPDF}
                className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              {/* Save Certificate as Image PNG */}
              <button
                type="button"
                disabled={isGeneratingImage}
                onClick={handleDownloadImage}
                className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isGeneratingImage ? 'Preparing Certificate...' : 'Save Image (PNG)'}</span>
              </button>

              {/* Custom copy url */}
              <button
                onClick={handleCopyCertificateLink}
                className="col-span-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link URL</span>
                  </>
                )}
              </button>

            </div>

            {/* Print Instructions card */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-2 text-[11px] text-indigo-950 font-semibold leading-relaxed">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>Pro-Tip for PDF Printing:</strong> Clicking <strong>Print</strong> brings up system options. Set layout to <strong>Landscape</strong> and disable <strong>"Headers and Footers"</strong> in More Settings for an absolute vector full-page document representation.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic WhatsApp Helper Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-905/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl space-y-5 text-left relative">
            <button 
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-450 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Phone className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-sm">WhatsApp Share Assistant</h3>
                <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wider uppercase">High-Quality Photo & PDF Sharing</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Because WhatsApp restricts web apps from automatically attaching local file attachments directly into messages, follow these <strong>2 quick steps</strong> to share your premium medal certificate:
            </p>

            <div className="space-y-4 divide-y divide-slate-100">
              
              {/* Step 1 */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-900 pt-1">
                  <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                  <span>Save Certificate to your Device:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6">
                  <button
                    disabled={isGeneratingImage}
                    onClick={async () => {
                      await handleDownloadImage();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-extrabold text-[11px] py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isGeneratingImage ? (
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingImage ? 'Preparing Certificate...' : 'Save PNG Photo'}</span>
                  </button>
                  
                   <button
                    onClick={() => {
                      handleDownloadPDF();
                    }}
                    disabled={isGeneratingImage}
                    className="bg-slate-100 hover:bg-slate-250 text-slate-800 font-extrabold text-[11px] py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                  >
                    {isGeneratingImage ? (
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-slate-800 border-t-transparent rounded-full"></span>
                    ) : (
                      <Printer className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingImage ? 'Preparing...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="pt-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                  <span className="bg-indigo-100 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                  <span>Attach Saved File & Post Link:</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-6 font-semibold leading-normal">
                  Click below to copy your academic verification credentials and launch WhatsApp. Then simply attach your downloaded certificate file to your WhatsApp message!
                </p>
                <div className="pl-6">
                  <button
                    onClick={handleLaunchWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Phone className="w-4 h-4 fill-white text-emerald-600" />
                    <span>{whatsappCopied ? 'Credentials Copied! Opening...' : 'Open WhatsApp & Paste Statement'}</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] text-slate-500 font-semibold leading-relaxed">
              💡 <strong>Instant Preview:</strong> Once shared, other parents can scan your custom QR code on the certificate to instantly inspect live records registry!
            </div>
          </div>
        </div>
      )}
      {/* 4. MEDIA SAVE & OFFLINE PREPARATION DIALOG */}
      {showSaveCenter && capturedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-left relative my-8">
            <button 
              onClick={() => setShowSaveCenter(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-450 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">Your High-Merit Certificate is Prepared!</h3>
                <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wider uppercase">High-Resolution Vector Graphics Ready</p>
              </div>
            </div>

            {/* Simulated certificate preview */}
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-1.5 overflow-hidden flex items-center justify-center max-w-full">
              <img 
                src={capturedImage} 
                alt="Prepared Academic Certificate" 
                referrerPolicy="no-referrer"
                className="w-full max-h-[340px] shadow-sm border border-slate-150 select-all rounded-lg select-none object-contain pointer-events-auto"
              />
            </div>

            {/* Instruction Warning message */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1.5 text-xs text-amber-900 leading-normal">
              <p className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <span className="text-sm">📱</span>
                Having trouble saving directly on your smartphone?
              </p>
              <ul className="list-disc pl-5 font-semibold space-y-1">
                <li><strong>Mobile Devices (WhatsApp/iOS/Android):</strong> Simply press and hold (long-press) on the certificate image above, and select <strong>"Add to Photos"</strong> or <strong>"Save Image"</strong>! It is now ready to share directly into your chat apps!</li>
                <li><strong>Web Browsers:</strong> If the automatic download didn\'t trigger, right-click the image above and click <strong>"Save image as..."</strong>.</li>
              </ul>
            </div>

            {/* Buttons row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Actual Anchor Tag with Direct Link Download to Bypass Iframe restrictions */}
              <a
                href={capturedImage}
                download={`IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.png`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Save PNG Photo</span>
              </a>

              {capturedPdf ? (
                <a
                  href={capturedPdf}
                  download={`IQ200_Certificate_${certificate.studentName.replace(/\s+/g, '_')}_${certificate.medal.toUpperCase()}.pdf`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Save PDF Document</span>
                </a>
              ) : (
                <button
                  onClick={handleDownloadPDF}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>Save PDF</span>
                </button>
              )}

              <button
                onClick={handleSystemShareImage}
                className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share PNG Photo</span>
              </button>

              <button
                onClick={handleSystemSharePDF}
                className="bg-indigo-505 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share PDF Document</span>
              </button>

              <button
                onClick={() => setShowSaveCenter(false)}
                className="col-span-2 lg:col-span-1 bg-slate-900 hover:bg-black text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer text-center"
              >
                <span>Close Preview</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
