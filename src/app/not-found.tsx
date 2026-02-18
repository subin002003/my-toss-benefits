import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <p className="text-gray-500">요청한 페이지를 찾을 수 없어요.</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
