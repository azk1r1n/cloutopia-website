import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-160px)] min-h-[600px]">
            <ChatInterface />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
