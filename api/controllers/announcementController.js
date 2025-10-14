import { db } from "../db.js";
 // your existing db connection file

// Get all announcements
export const getAnnouncements = (req, res) => {
  const q = "SELECT * FROM announcement ORDER BY created_at DESC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(data);
  });
};

// Add new announcement
export const addAnnouncement = (req, res) => {
  const { heading, content } = req.body;
  if (!heading || !content)
    return res.status(400).json({ error: "Both heading and content are required" });

  const q = "INSERT INTO announcement (heading, content) VALUES (?, ?)";
  db.query(q, [heading, content], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Announcement added successfully" });
  });
};

// Update announcement
export const updateAnnouncement = (req, res) => {
  const { id } = req.params;
  const { heading, content } = req.body;

  const q = "UPDATE announcement SET heading = ?, content = ? WHERE announcement_id = ?";
  db.query(q, [heading, content, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Announcement updated successfully" });
  });
};

// Delete announcement
export const deleteAnnouncement = (req, res) => {
  const { id } = req.params;

  const q = "DELETE FROM announcement WHERE announcement_id = ?";
  db.query(q, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Announcement deleted successfully" });
  });
};
