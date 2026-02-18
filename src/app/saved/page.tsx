import { Header } from "@/components/layout/Header";
import { SavedContent } from "@/components/saved/SavedContent";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <SavedContent />
      </main>
    </div>
  );
}
