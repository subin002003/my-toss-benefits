import { BackButton } from "@/components/common/BackButton";
import { SavedContent } from "@/components/saved/SavedContent";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <BackButton />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-gray-900">
          저장함
        </h1>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <SavedContent />
      </main>
    </div>
  );
}
