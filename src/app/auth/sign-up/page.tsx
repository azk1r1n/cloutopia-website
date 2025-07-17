import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/assets/cloutopia-logo4.png"
              alt="Cloutopia Logo"
              width={1024}
              height={1024}
              className="w-16 h-16 mx-auto mb-4"
              priority
            />
            <h1 className="text-3xl font-bold text-gray-900">Join Cloutopia</h1>
            <p className="text-gray-600 mt-2">Create your account to start exploring clouds</p>
          </div>
          
          <SignUpForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
