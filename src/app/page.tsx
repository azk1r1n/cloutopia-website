import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="h-[100dvh] flex flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-hidden min-h-0">
        <ChatInterface />
      </main>
    </div>
  );
}
