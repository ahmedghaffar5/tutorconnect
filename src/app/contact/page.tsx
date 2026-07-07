"use client";

import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-gray-600 text-lg">
            We&apos;d love to hear from you. Get in touch with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">info@tutorconnect.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-green-50 rounded-2xl border border-green-100 shadow-sm hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                <p className="text-green-600 font-medium">Chat with us</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">Online - Serving students worldwide</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Your message"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
