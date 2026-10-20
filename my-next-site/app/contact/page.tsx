export default function ContactPage() {
  return (
    <main className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="mb-8">
          Have questions, suggestions or business inquiries? Fill out the form below or send us an email directly.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="mb-4">Email: [Your Contact Email]</p>
            <p className="mb-4">We typically reply within 2–3 business days.</p>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Common topics:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tool feature requests</li>
                <li>Technical issues</li>
                <li>Advertising & partnership</li>
                <li>Privacy related questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}