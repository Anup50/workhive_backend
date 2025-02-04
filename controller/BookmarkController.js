const Bookmark = require("../model/Bookmark");

class BookmarkController {
  async create(req, res) {
    const { jobSeekerId, jobId } = req.body;

    try {
      const newBookmark = new Bookmark({ jobSeekerId, jobId });
      await newBookmark.save();
      res.status(201).json({ success: true, data: newBookmark });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async remove(req, res) {
    const { bookmarkId } = req.params;

    try {
      const bookmark = await Bookmark.findByIdAndDelete(bookmarkId);
      if (!bookmark) {
        return res
          .status(404)
          .json({ success: false, message: "Bookmark not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Bookmark removed successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByJobSeeker(req, res) {
    const { jobSeekerId } = req.params;

    try {
      const bookmarks = await Bookmark.find({ jobSeekerId }).populate("jobId");
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByJob(req, res) {
    const { jobId } = req.params;

    try {
      const bookmarks = await Bookmark.find({ jobId }).populate("jobSeekerId");
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BookmarkController();
