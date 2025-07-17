import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered an error while processing your request.
              </p>
              {params?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-600">
                    Error: {params.error}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <p className="text-sm text-gray-500">
                or{" "}
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  go back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
