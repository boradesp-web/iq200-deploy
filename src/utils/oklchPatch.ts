import html2canvas from 'html2canvas';

export function replaceOklchWithRgb(cssText: string): string {
  if (!cssText) return cssText;

  // 1. Patch oklch()
  const oklchRegex = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;
  let result = cssText.replace(oklchRegex, (match, lStr, cStr, hStr, aStr) => {
    try {
      let l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
      let c = parseFloat(cStr);
      let h = parseFloat(hStr);
      
      const h_rad = (h * Math.PI) / 180;
      const aVal = c * Math.cos(h_rad);
      const bVal = c * Math.sin(h_rad);

      return convertOklabToRgbaString(l, aVal, bVal, aStr);
    } catch (e) {
      return "rgb(100, 116, 139)";
    }
  });

  // 2. Patch oklab()
  const oklabRegex = /oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi;
  result = result.replace(oklabRegex, (match, lStr, aStr, bStr, alphaStr) => {
    try {
      let l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
      let aVal = parseFloat(aStr);
      let bVal = parseFloat(bStr);

      return convertOklabToRgbaString(l, aVal, bVal, alphaStr);
    } catch (e) {
      return "rgb(100, 116, 139)";
    }
  });

  // 3. Simple patch for color-mix(...) when used with oklab/oklch to prevent html2canvas crashing
  if (result.includes('color-mix')) {
    // Try to extract the main variable if it's an opacity mix
    result = result.replace(/color-mix\([^()]*var\((--[^()]+)\)[^()]*\)/g, 'var($1)');
    // Fallback for any remaining color-mix
    result = result.replace(/color-mix\([^()]*(?:\([^()]*\)[^()]*)*\)/g, 'rgba(0, 0, 0, 0.1)'); 
  }

  return result;
}

function convertOklabToRgbaString(l: number, aVal: number, bVal: number, aStr?: string) {
  const l_ = l + 0.3963377774 * aVal + 0.2158037573 * bVal;
  const m_ = l - 0.1055613458 * aVal - 0.0638541728 * bVal;
  const s_ = l - 0.0894841775 * aVal - 1.2914855414 * bVal;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193955 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const gamma = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  const R = Math.round(gamma(r) * 255);
  const G = Math.round(gamma(g) * 255);
  const B = Math.round(gamma(b_) * 255);

  if (aStr) {
    let alpha = aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  } else {
    return `rgb(${R}, ${G}, ${B})`;
  }
}


/**
 * Temporarily patches style elements and individual style attributes,
 * executes html2canvas safely without any "unsupported color function oklch" errors,
 * and recovers original style declarations immediately upon completion.
 */
export function executeHtml2CanvasWithOklchPatch(
  element: HTMLElement,
  options: Parameters<typeof html2canvas>[1] = {}
): Promise<HTMLCanvasElement> {
  const styleElMap = new Map<HTMLStyleElement, string>();

  // Patch in-DOM style tags to replace oklch declarations temporarily
  document.querySelectorAll('style').forEach((styleEl) => {
    if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
      styleElMap.set(styleEl, styleEl.textContent);
      styleEl.textContent = replaceOklchWithRgb(styleEl.textContent);
    }
  });

  const userOnClone = options.onclone;
  const enhancedOptions = {
    ...options,
    onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
      // Convert oklch in styled attributes inside clone window
      clonedDoc.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
        const styleAttr = el.getAttribute('style');
        if (styleAttr && styleAttr.includes('oklch')) {
          el.setAttribute('style', replaceOklchWithRgb(styleAttr));
        }
      });

      // Convert any leftover style elements in cloned window head
      clonedDoc.querySelectorAll<HTMLStyleElement>('style').forEach((styleEl) => {
        if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
          styleEl.textContent = replaceOklchWithRgb(styleEl.textContent);
        }
      });

      if (userOnClone) {
        userOnClone(clonedDoc, clonedEl);
      }
    }
  };

  return html2canvas(element, enhancedOptions).finally(() => {
    // Gracefully restore original stylesheet contents to preserve exact styling & visual effects after rendering
    styleElMap.forEach((originalContent, styleEl) => {
      styleEl.textContent = originalContent;
    });
  });
}
