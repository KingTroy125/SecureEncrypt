import React from 'react';
import { Shield, Lock, Key, FileText, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-800">
      {/* Header */}
      <header className="pt-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">SecureEncrypt</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-indigo-400 opacity-70 blur-lg"></div>
              <div className="relative bg-indigo-600 p-6 rounded-full">
                <Lock className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Secure Your Data with <span className="text-indigo-300">AES-256</span> Encryption
          </h1>
          
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Protect your sensitive information with military-grade encryption that never leaves your device.
            Simple, secure, and completely private.
          </p>
          
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-full overflow-hidden shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-white to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>

        {/* Features */}
        <div className="container mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-indigo-300/20 hover:bg-white/20 transition">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AES-256 Encryption</h3>
            <p className="text-indigo-100">
              Industry-standard encryption algorithm used by governments and security experts worldwide.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-indigo-300/20 hover:bg-white/20 transition">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Key className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Key Management</h3>
            <p className="text-indigo-100">
              Generate, save, and manage your encryption keys with an intuitive interface.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-indigo-300/20 hover:bg-white/20 transition">
            <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">File Support</h3>
            <p className="text-indigo-100">
              Upload text files for encryption and download the encrypted results for secure storage.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-indigo-200 text-sm">
        <p>SecureEncrypt - AES-256 Encryption Tool &copy; {new Date().getFullYear()}</p>
        <p className="text-indigo-300/70 text-xs mt-1">
          All encryption and decryption is performed locally in your browser. Your data never leaves your device.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;