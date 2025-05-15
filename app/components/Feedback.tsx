"use client";

export default function Feedback({ feedbacks }: { feedbacks: any[] }) {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg text-black">
        <p>No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-black overflow-auto">
      <h1 className="text-2xl font-bold text-center mb-4">📝 User Feedback</h1>

      <table className="min-w-full table-auto border border-gray-300 text-sm text-black">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">
                {fb.user?.name || fb.user?.email || "Unnamed User"}
              </td>
              <td className="p-2 border whitespace-pre-wrap">{fb.message}</td>
              <td className="p-2 border">
                {new Date(fb.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
