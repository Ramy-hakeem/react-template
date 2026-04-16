import { useState, useCallback } from 'react';

export default function useCopyToClipboard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);

    const timeoutId = setTimeout(() => {
      setCopiedField(null);
    }, 2000);

    return timeoutId;
  }, []);

  return { copiedField, copyToClipboard };
}
