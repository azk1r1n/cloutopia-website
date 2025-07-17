import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Mail, CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg text-center">
            <div className="mb-6">
              <Image
                src="/assets/cloutopia-logo4.png"
                alt="Cloutopia Logo"
                width={1024}
                height={1024}
                className="w-16 h-16 mx-auto mb-4"
                priority
              />
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email!
              </h1>
              <p className="text-gray-600">
                We&apos;ve sent you a confirmation link to complete your registration.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Next Steps</span>
              </div>
              <p className="text-sm text-blue-600">
                Click the link in your email to verify your account and start exploring cloud formations!
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email? Check your spam folder or
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Try signing up again
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
