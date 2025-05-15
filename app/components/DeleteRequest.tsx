"use client";

import { useState } from "react";

export default function DeleteRequest({ requests }: { requests: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const paginatedRequests = requests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-black overflow-auto">
      <h1 className="text-2xl text-center font-bold mb-4">🗑️ Account Delete Requests</h1>

      {requests.length === 0 ? (
        <p>No delete requests at this time.</p>
      ) : (
        <>
          <table className="min-w-full table-auto border border-gray-300 text-sm text-black">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => {
                if (!req || !req.user) return null;
                return (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{req.user.name || "Unnamed User"}</td>
                    <td className="p-2 border">{req.user.email}</td>
                    <td className="p-2 border">{req.reason || "N/A"}</td>
                    <td className="p-2 border">
                      <span
                        className={`font-semibold ${
                          req.status === "APPROVED"
                            ? "text-green-600"
                            : req.status === "REJECTED"
                            ? "text-red-600"
                            : req.status === "COMPLETED"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                        Delete User
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {requests.length > requestsPerPage && (
            <div className="flex justify-between mt-6 text-black">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                ◀️ Prev
              </button>
              <span className="text-sm text-gray-700 self-center">
                Page {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(requests.length / requestsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage >= Math.ceil(requests.length / requestsPerPage)
                }
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Next ▶️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
