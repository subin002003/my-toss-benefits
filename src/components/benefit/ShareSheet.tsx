"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, MessageCircle, Mail, Send } from "lucide-react";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
}

interface ShareOption {
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.722 1.8 5.108 4.509 6.457l-1.15 4.267a.5.5 0 0 0 .77.527l5.003-3.306c.283.02.57.03.868.03 5.523 0 10-3.463 10-7.975S17.523 3 12 3z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.27 8.846 10.035 9.608.391.084.922.258 1.057.592.121.303.079.777.039 1.082l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.217 14.254 24 12.382 24 10.304zm-16.86 3.39a.307.307 0 0 1-.307.308H4.478a.307.307 0 0 1-.307-.307V8.602a.307.307 0 0 1 .307-.308h.614a.307.307 0 0 1 .307.308v4.478h1.434a.307.307 0 0 1 .307.307zm2.032-.001a.307.307 0 0 1-.307.308h-.614a.307.307 0 0 1-.307-.307V8.602a.307.307 0 0 1 .307-.308h.614a.307.307 0 0 1 .307.308zm5.256 0a.307.307 0 0 1-.307.308h-.614a.302.302 0 0 1-.218-.092l-1.744-2.354v2.139a.307.307 0 0 1-.307.307h-.614a.307.307 0 0 1-.307-.307V8.602a.307.307 0 0 1 .307-.308h.614a.3.3 0 0 1 .218.092l1.744 2.354V8.602a.307.307 0 0 1 .307-.308h.614a.307.307 0 0 1 .307.308zm3.793-4.484a.307.307 0 0 1-.307.308h-1.434v.921h1.434a.307.307 0 0 1 .307.308v.614a.307.307 0 0 1-.307.307h-1.434v.921h1.434a.307.307 0 0 1 .307.308v.614a.307.307 0 0 1-.307.307h-2.355a.307.307 0 0 1-.307-.307V8.602a.307.307 0 0 1 .307-.308h2.355a.307.307 0 0 1 .307.308z" />
    </svg>
  );
}

export function ShareSheet({ open, onClose, title, text, url }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const shareMessage = `${title}\n${text}\n${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} - ${text}`);
  const encodedMessage = encodeURIComponent(shareMessage);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사해 주세요:", url);
    }
  }

  const options: ShareOption[] = [
    {
      label: "카카오톡",
      icon: <KakaoIcon />,
      color: "#FEE500",
      action: () => {
        if (window.Kakao?.isInitialized()) {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title,
              description: text,
              imageUrl: `${url}/og-image.png`,
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: [
              { title: "혜택 보러 가기", link: { mobileWebUrl: url, webUrl: url } },
            ],
          });
        } else {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(
              () => alert("카카오 SDK를 불러오는 중입니다. 링크가 복사되었어요!"),
              () => window.prompt("아래 링크를 복사해 주세요:", url),
            );
          } else {
            window.prompt("아래 링크를 복사해 주세요:", url);
          }
        }
      },
    },
    {
      label: "문자",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "#34C759",
      action: () => { window.location.href = `sms:?&body=${encodedMessage}`; },
    },
    {
      label: "이메일",
      icon: <Mail className="h-6 w-6" />,
      color: "#5856D6",
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedMessage}`;
      },
    },
    {
      label: "X",
      icon: <XLogo />,
      color: "#000000",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank");
      },
    },
    {
      label: "페이스북",
      icon: <FacebookIcon />,
      color: "#1877F2",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
      },
    },
    {
      label: "LINE",
      icon: <LineIcon />,
      color: "#06C755",
      action: () => {
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`, "_blank");
      },
    },
    {
      label: "텔레그램",
      icon: <Send className="h-6 w-6" />,
      color: "#26A5E4",
      action: () => {
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
      },
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* 백드롭 */}
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* 시트 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-xl sm:rounded-3xl sm:mb-0"
          >
            {/* 모바일 그랩 핸들 */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

            {/* 헤더 */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">공유하기</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 공유 옵션 그리드 */}
            <div className="grid grid-cols-4 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => { opt.action(); onClose(); }}
                  className="flex flex-col items-center gap-2 rounded-2xl py-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: opt.color, color: opt.label === "카카오톡" ? "#3C1E1E" : "white" }}
                  >
                    {opt.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{opt.label}</span>
                </button>
              ))}

              {/* URL 복사 */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 rounded-2xl py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-200 text-gray-700">
                  {copied ? <Check className="h-6 w-6 text-green-600" /> : <Copy className="h-6 w-6" />}
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {copied ? "복사됨!" : "URL 복사"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
