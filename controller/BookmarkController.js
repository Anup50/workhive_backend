const Bookmark = require("../model/Bookmark");

class BookmarkController {
  async createBookmark(req, res) {
    try {
      const { jobId, jobSeekerId } = req.body;
      const existingBookmark = await Bookmark.findOne({ jobId, jobSeekerId });

      if (existingBookmark) {
        return res
          .status(400)
          .json({ success: false, message: "Bookmark already exists" });
      }

      const newBookmark = await Bookmark.create({ jobId, jobSeekerId });
      res.status(201).json({ success: true, bookmark: newBookmark });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteBookmark(req, res) {
    try {
      const { jobId, jobSeekerId } = req.params;
      const deletedBookmark = await Bookmark.findOneAndDelete({
        jobId,
        jobSeekerId,
      });

      if (!deletedBookmark) {
        return res
          .status(404)
          .json({ success: false, message: "Bookmark not found" });
      }

      res.status(200).json({ success: true, message: "Bookmark removed" });
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

  async isBookmarked(req, res) {
    try {
      const { jobId, jobSeekerId } = req.params;
      const bookmark = await Bookmark.findOne({ jobId, jobSeekerId });
      res.status(200).json({ success: true, bookmarked: !!bookmark });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BookmarkController();
