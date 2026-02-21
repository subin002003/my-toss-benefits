import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg space-y-4 text-xs leading-relaxed text-gray-400">
        <div className="flex items-start gap-2">
          <span className="mt-px shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-500">
            공공데이터
          </span>
          <p>
            본 서비스는{" "}
            <a
              href="https://www.data.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-gray-500 underline underline-offset-2 hover:text-gray-600"
            >
              공공데이터포털(data.go.kr)
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            의 API 데이터를 활용하여 제공됩니다. 정부 데이터는 실시간으로
            변동될 수 있으므로 실제와 다를 수 있습니다.
          </p>
        </div>

        <p>
          본 서비스는 비상업적 목적의 포트폴리오 프로젝트이며, 실제 혜택
          신청은 해당 기관의 공식 홈페이지를 통해 확인해 주세요.
        </p>

        <p>
          사용자가 입력한 닉네임 및 설정 정보는 서비스 개선 및 맞춤형 환경
          제공을 위해 로컬 스토리지에 안전하게 저장됩니다.
        </p>

        <div className="flex items-center gap-1.5 pt-2 text-gray-300">
          <span>&copy; 2026 이수빈(Subin Lee)</span>
          <span>|</span>
          <a
            href="https://github.com/subin002003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 underline underline-offset-2 hover:text-gray-500"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
