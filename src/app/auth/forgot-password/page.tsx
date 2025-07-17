import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Image from "next/image";

export default function ForgotPasswordPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 mt-2">We&apos;ll send you a reset link</p>
          </div>
          
          <ForgotPasswordForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
