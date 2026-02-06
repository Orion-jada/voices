export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Contact Us</h1>
      <div className="bg-white p-8 rounded shadow text-center space-y-4">
        <p className="text-lg">We'd love to hear from you!</p>
        <p className="text-gray-600">For inquiries, submissions, or feedback, please reach out to us at:</p>
        <a href="mailto:voices@masterman.phila.k12.pa.us" className="text-2xl font-bold text-blue-600 hover:underline block my-4">
          voices@masterman.phila.k12.pa.us
        </a>
        <p className="text-sm text-gray-500 mt-8">
          Julia R. Masterman Laboratory and Demonstration School<br/>
          1699 Spring Garden St<br/>
          Philadelphia, PA 19130
        </p>
      </div>
    </div>
  );
}
