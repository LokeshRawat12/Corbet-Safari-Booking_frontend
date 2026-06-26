import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function ContactManager() {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const response = await apiFetch("/api/contact");
      if (response.ok) {
        setMessages(await response.json());
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await apiFetch(`/api/contact/${id}`, { method: "DELETE" });
      loadMessages();
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  const fmtDate = (iso) => {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Contact Messages</h2>
        <p className="text-xs text-white/40">{messages.length} messages received</p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-white/30 italic rounded-2xl border border-white/10 bg-white/5">
            No messages found.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-white">{m.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                    <span>📧 {m.email}</span>
                    <span>📞 {m.phone}</span>
                    <span>📅 {fmtDate(m.submittedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(m._id)}
                  className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-black/20 p-4">
                <p className="text-sm text-white/80 whitespace-pre-wrap">{m.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
