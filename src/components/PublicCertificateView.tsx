import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Share2, Copy, Check, MessageSquare, Twitter, Facebook, 
  ExternalLink, ShieldCheck, RefreshCw, Smartphone, Star, Send, ArrowLeft,
  X, Phone, Printer, Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { executeHtml2CanvasWithOklchPatch } from '../utils/oklchPatch';
import { Certificate } from '../types';

interface PublicCertificateViewProps {
  certificateId: string;
}

export default function PublicCertificateView({ certificateId }: PublicCertificateViewProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [showSaveCenter, setShowSaveCenter] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedPdf, setCapturedPdf] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/certificates/${certificateId}`);
        const data = await res.json();
        if (data.success && data.certificate) {
          setCertificate(data.certificate);
        } else {
          setError(data.error || 'The requested academic certificate is invalid.');
        }
      } catch (err) {
        console.error('Failed to query certificate details:', err);
        setError('Connection timeout. Please double check the certification ID.');
      } finally {
        setLoading(false);
      }
    };
    if (certificateId) {
      fetchCert();
    }
  }, [certificateId]);

  const handleCopyLink = () => {
    const shareUrl = `https://www.iq200olympiad.org/certificate/${certificateId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Sovereign Scholar';
    return fullName.trim().split(' ')[0];
  };

  // Separate premium designs mapping for Gold, Silver, Bronze, and Participation
  const medalThemes = {
    gold: {
      borderClass: 'border-amber-500 bg-amber-50/20',
      borderColorHex: '#d97706',
      badgeTitle: 'GOLD MEDAL ACHIEVER',
      badgeSubtitle: 'Curriculum Master Excellence',
      backgroundGradient: 'from-amber-50 via-yellow-100/30 to-amber-50/20',
      sealColor: 'border-amber-500 text-amber-600 bg-amber-50',
      medalIcon: (
        <svg className="w-16 h-16 text-amber-500 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#goldGrad)" className="stroke-[2] stroke-amber-600" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#fef3c7" strokeWidth="2" strokeDasharray="4 2" />
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
      medalIcon: (
        <svg className="w-16 h-16 text-slate-400 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#silverGrad)" className="stroke-[2] stroke-slate-500" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 2" />
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
      medalIcon: (
        <svg className="w-16 h-16 text-orange-700 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#bronzeGrad)" className="stroke-[2] stroke-orange-800" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#ffedd5" strokeWidth="2" strokeDasharray="4 2" />
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
      medalIcon: (
        <svg className="w-16 h-16 text-indigo-600 drop-shadow" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" fill="url(#partGrad)" className="stroke-[2] stroke-indigo-800" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#e0e7ff" strokeWidth="2" strokeDasharray="4 2" />
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
        <p className="text-slate-500 font-bold">Querying the IQ200 practice certificate database registry...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 space-y-4 shadow-sm">
          <Award className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-rose-950">Certificate Entry Invalid</h2>
          <p className="text-sm text-slate-500">{error || 'Certificate database check failed.'}</p>
        </div>
        <a href="/" className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-xs font-black hover:bg-slate-800 transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Academy Portal</span>
        </a>
      </div>
    );
  }

  const activeTheme = medalThemes[certificate.medal] || medalThemes.participation;
  const studentFirstName = getFirstName(certificate.studentName);
  
  const certificateUrl = `https://www.iq200olympiad.org/certificate/${certificate.id}`;
  const shareStatement = `${certificate.studentName} earned a ${certificate.medal.charAt(0).toUpperCase() + certificate.medal.slice(1)} Medal on IQ200 Olympiad.\nScore: ${certificate.score}/${certificate.totalQuestions || 10}\nVerify Certificate:\n${certificateUrl}\nPractice Olympiad Tests:\nhttps://www.iq200olympiad.org`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareStatement);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
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
      const filename = `Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.png`;
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
      const filename = `Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.pdf`;
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
      const studentFirstName = getFirstName(certificate.studentName);
      const filename = `Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.png`;
      
      if (typeof navigator !== 'undefined' && navigator.share) {
        const res = await fetch(assets.imageUri);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Verified Certificate - ${certificate.studentName}`,
            text: `${shareStatement}\nVerify here: ${certificateUrl}`
          });
        } else {
          await navigator.share({
            title: `Verified Certificate - ${certificate.studentName}`,
            text: `${shareStatement}\nVerify here: ${certificateUrl}`
          });
        }
      } else {
        navigator.clipboard.writeText(certificateUrl);
        triggerBlobDownload(assets.imageUri, filename);
        alert("Verification link copied to clipboard and PNG downloaded! Direct device sharing isn't supported on this browser.");
      }
    } catch (err) {
      console.warn("Share image action failed:", err);
    }
  };

  const handleSystemSharePDF = async () => {
    const assets = await handleGenerateSaveElements();
    if (!assets || !assets.pdfUrl) {
      alert('Certificate layout engine not found or failed.');
      return;
    }

    try {
      const studentFirstName = getFirstName(certificate.studentName);
      const filename = `Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.pdf`;
      const res = await fetch(assets.pdfUrl);
      const pdfBlob = await res.blob();
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (typeof navigator !== 'undefined' && navigator.share) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Verified PDF Certificate - ${certificate.studentName}`,
            text: `Here is the verified digital PDF certificate. Verify here: ${certificateUrl}`
          });
        } else {
          await navigator.share({
            title: `Verified PDF Certificate - ${certificate.studentName}`,
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
      console.warn("Share PDF action failed:", err);
    }
  };

  const handleSystemShare = async () => {
    await handleSystemShareImage();
  };

  const shareWhatsApp = () => {
    setIsWhatsAppModalOpen(true);
  };

  const handleLaunchWhatsApp = () => {
    navigator.clipboard.writeText(shareStatement);
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 2505);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(certificateUrl)}&text=${encodeURIComponent(shareStatement)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}`, '_blank');
  };

  const handleTriggerPrint = async () => {
    const assets = await handleGenerateSaveElements();
    if (!assets || !assets.imageUri) {
      window.print();
      return;
    }

    try {
      // Create isolated system print framing
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

        // Let the system spool, then remove
        setTimeout(() => {
          if (document.getElementById('certificate-print-iframe')) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Print iframe rendering fallbacks:', err);
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-8">
      
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
            backgroundImage: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.96) 0%, rgba(253, 251, 245, 0.99) 100%)',
          }}
        >
          {/* Corner filigree corners */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 rounded-br-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>

          {activeTheme.borderDecoration}

          {/* Header Institution */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-center items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <div className="text-left leading-none font-sans">
                <span className="text-[10px] font-black tracking-widest text-slate-500 block">IQ200 OLYMPIAD</span>
                <span className="text-[8px] font-bold text-slate-400 block tracking-widest uppercase mt-0.5">OFFICIAL CERTIFICATE VERIFICATION PORTAL</span>
              </div>
            </div>

            <div className="h-0.5 w-1/4 bg-amber-600/30 mx-auto my-1" />

            <h1 className="font-serif font-black italic text-4xl text-slate-900 tracking-tight uppercase">
              Certificate of High Merit
            </h1>
            <p className="text-[10px] font-serif uppercase tracking-widest font-black text-slate-400 mt-0.5 leading-none">
              Honorable Practice Merit
            </p>
          </div>

          {/* Student Identification */}
          <div className="space-y-4 my-6 relative z-10 leading-none">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-sans block">Candidate Authenticated</span>
            <h2 className="font-serif font-black text-4xl text-amber-950 underline decoration-amber-600 decoration-double underline-offset-8 uppercase leading-normal">
              {certificate.studentName}
            </h2>
          </div>

          {/* Dynamic results statements */}
          <div className="max-w-xl mx-auto font-serif text-sm text-slate-700 leading-relaxed italic space-y-4 relative z-10">
            <p>
              Has successfully completed the grade practice assessment suite of{' '}
              <span className="font-sans font-black text-slate-900 not-italic uppercase text-xs bg-slate-100 py-0.5 px-2 rounded">
                {certificate.classLevel} {certificate.subject}
              </span>
            </p>
            <p>
              Achieving a commendable score registry of{' '}
              <span className="font-sans font-black text-indigo-600 not-italic">
                {certificate.score} Correct answers
              </span>
              , has been awarded:
            </p>
          </div>

          {/* Seal and signatures */}
          <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200/80 relative z-10 text-left">
            
            {/* Signature Dean */}
            <div className="flex flex-col items-start space-y-1 text-left leading-none font-sans text-xs">
              <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">Academy Assessor</span>
              <div className="w-36 border-b border-zinc-200 my-0.5"></div>
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">IQ200 Evaluation Lead</span>
            </div>

            {/* Central Seal Badge */}
            <div className="flex flex-col items-center justify-center space-y-1 text-center leading-none mt-2">
              <div className="flex items-center justify-center">
                {activeTheme.medalIcon}
              </div>
              <span className="text-[9px] font-black text-indigo-950 uppercase tracking-widest mt-1">
                {activeTheme.badgeTitle}
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

            {/* Signature standards director */}
            <div className="flex flex-col items-end space-y-1 text-right leading-none font-sans text-xs">
              <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">Curriculum Committee</span>
              <div className="w-36 border-b border-zinc-200 my-0.5"></div>
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Director of Curriculum Standards</span>
            </div>

          </div>

        </div>
      </div>

      {/* HEADER VERIFICATION STATUS STRIP */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500 text-white rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold text-sm sm:text-base">Verified IQ200 Student Certificate</h3>
            <p className="text-xs text-slate-500">
              Registration Serial: <span className="font-mono font-black text-indigo-600 select-all">{certificate.uniqueId || certificate.id || 'N/A'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/60 py-1.5 px-3.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Verified Student Practice Record</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CERTIFICATE DISPLAY CORE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-slate-50 p-1 rounded-3xl border border-slate-250 shadow-2xl flex items-center justify-start overflow-hidden mx-auto max-w-full" ref={containerRef} style={{ height: `${700 * scale}px`, width: '100%' }}>
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
                backgroundImage: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.96) 0%, rgba(253, 251, 245, 0.99) 100%)',
              }}
            >
              {/* Corner filigree corners */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
              <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 rounded-br-lg pointer-events-none" style={{ borderColor: activeTheme.borderColorHex }}></div>

              {activeTheme.borderDecoration}

              {/* Header Institution */}
              <div className="space-y-4 relative z-10">
                <div className="flex justify-center items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  <div className="text-left leading-none font-sans">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 block">IQ200 OLYMPIAD</span>
                    <span className="text-[8px] font-bold text-slate-400 block tracking-widest uppercase mt-0.5">OFFICIAL CERTIFICATE VERIFICATION PORTAL</span>
                  </div>
                </div>

                <div className="h-0.5 w-1/4 bg-amber-600/30 mx-auto my-1" />

                <h1 className="font-serif font-black italic text-4xl text-slate-900 tracking-tight uppercase">
                  Certificate of High Merit
                </h1>
                <p className="text-[10px] font-serif uppercase tracking-widest font-black text-slate-400 mt-0.5 leading-none">
                  Honorable Practice Merit
                </p>
              </div>

              {/* Student Identification */}
              <div className="space-y-4 my-6 relative z-10 leading-none">
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-sans block">Candidate Authenticated</span>
                <h2 className="font-serif font-black text-4xl text-amber-950 underline decoration-amber-600 decoration-double underline-offset-8 uppercase leading-normal">
                  {certificate.studentName}
                </h2>
              </div>

              {/* Dynamic results statements */}
              <div className="max-w-xl mx-auto font-serif text-sm text-slate-700 leading-relaxed italic space-y-4 relative z-10">
                <p>
                  Has successfully completed the grade practice assessment suite of{' '}
                  <span className="font-sans font-black text-slate-900 not-italic uppercase text-xs bg-slate-100 py-0.5 px-2 rounded">
                    {certificate.classLevel} {certificate.subject}
                  </span>
                </p>
                <p>
                  Achieving a commendable score registry of{' '}
                  <span className="font-sans font-black text-indigo-600 not-italic">
                    {certificate.score} Correct answers
                  </span>
                  , has been awarded:
                </p>
              </div>

              {/* Seal and signatures */}
              <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200/80 relative z-10 text-left">
                
                {/* Signature Dean */}
                <div className="flex flex-col items-start space-y-1 text-left leading-none font-sans text-xs">
                  <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">Academy Assessor</span>
                  <div className="w-36 border-b border-zinc-200 my-0.5"></div>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">IQ200 Evaluation Lead</span>
                </div>

                {/* Central Seal Badge */}
                <div className="flex flex-col items-center justify-center space-y-1 text-center leading-none mt-2">
                  <div className="flex items-center justify-center">
                    {activeTheme.medalIcon}
                  </div>
                  <span className="text-[9px] font-black text-indigo-950 uppercase tracking-widest mt-1">
                    {activeTheme.badgeTitle}
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

                {/* Signature standards director */}
                <div className="flex flex-col items-end space-y-1 text-right leading-none font-sans text-xs">
                  <span className="font-script text-3.5xl text-indigo-950 font-semibold select-none">Curriculum Committee</span>
                  <div className="w-36 border-b border-zinc-200 my-0.5"></div>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Director of Curriculum Standards</span>
                </div>

              </div>

            </div>
            
          </div>

          <p className="text-center text-xs text-slate-400 italic font-medium">
            🛡️ Security Protection: Student record is verified using the public dynamic code database matching original candidate submission logs.
          </p>
        </div>

        {/* VERIFIED ACCREDITATION CONTROLS */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <Star className="w-5 h-5 text-indigo-600 fill-indigo-100" />
              Verified Certificate Registry
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              This credential record has been cross-referenced and verified directly against the host databases. Relatives or academic recruiters can safely honor this credential.
            </p>

            <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl font-extrabold text-slate-800 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-slate-500" />
                  Copy Shareable link
                </span>
                {copiedLink ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] py-0.5 px-2 rounded-full flex items-center gap-0.5 font-bold">
                    <Check className="w-3 h-3 stroke-[3]" /> Copied
                  </span>
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <button
                onClick={handleCopyText}
                className="w-full text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-900 py-3 rounded-xl border border-indigo-150 transition-all cursor-pointer"
              >
                {copiedText ? 'Copy succeeded!' : 'Copy Verification text'}
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={handleDownloadImage}
                  className="bg-violet-650 hover:bg-violet-750 disabled:bg-violet-300 text-white font-extrabold text-[11px] py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isGeneratingImage ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isGeneratingImage ? 'Preparing Certificate...' : 'Save PNG Image'}</span>
                </button>

                <button
                  disabled={isGeneratingImage}
                  onClick={handleDownloadPDF}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 border border-slate-200 text-slate-800 font-extrabold text-[11px] py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isGeneratingImage ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Printer className="w-3.5 h-3.5" />
                  )}
                  <span>{isGeneratingImage ? 'Preparing...' : 'Download PDF'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Social icons toolbar */}
          <div className="bg-slate-950 text-slate-200 p-6 rounded-3xl space-y-4 text-left">
            <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400 font-mono block">Direct Channels dispatch</span>
            
            <div className="grid grid-cols-2 gap-2.5">
              
              <button
                onClick={shareWhatsApp}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-2.5 rounded-lg cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareTwitter}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-black text-white font-extrabold text-[11px] py-2.5 rounded-lg cursor-pointer transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X Twitter</span>
              </button>

              <button
                onClick={shareTelegram}
                className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[11px] py-2.5 rounded-lg cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              <button
                onClick={shareFacebook}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] py-2.5 rounded-lg cursor-pointer transition-colors text-center"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>

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
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full font-sans"></span>
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingImage ? 'Preparing Certificate...' : 'Save PNG Photo'}</span>
                  </button>
                  
                  <button
                    disabled={isGeneratingImage}
                    onClick={() => {
                      handleDownloadPDF();
                    }}
                    className="bg-slate-100 hover:bg-slate-250 disabled:opacity-50 text-slate-800 font-extrabold text-[11px] py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
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
                download={`Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.png`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Save PNG Photo</span>
              </a>

              {capturedPdf ? (
                <a
                  href={capturedPdf}
                  download={`Verified_Certificate_${studentFirstName}_${certificate.medal.toUpperCase()}.pdf`}
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
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[11px] py-3.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-center"
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
