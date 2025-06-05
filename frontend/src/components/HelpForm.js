import React, { useState } from "react";
import axios from "axios";

function HelpForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      await axios.post("http://localhost:8081/api/contact", form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSuccess("You can't send gmails localy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Help</h2>
      <input
        name="name"
        className="form-control mb-2"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        className="form-control mb-2"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="subject"
        className="form-control mb-2"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        className="form-control mb-2"
        placeholder="Message"
        rows={4}
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
      {success && <div className="mt-2">{success}</div>}
    </form>
  );
}

export default HelpForm;
