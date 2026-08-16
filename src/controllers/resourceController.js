const Resource = require('../models/Resource');
const User = require('../models/User');

// GET /api/v1/resources
exports.getResources = async (req, res) => {
  try {
    const { branch, semester, subject, category, search, sort = 'newest', page = 1, limit = 12 } = req.query;

    const query = { status: 'PUBLISHED' };

    if (branch) query.branchId = branch;
    if (semester) query.semesterId = semester;
    if (subject) query.subjectId = subject;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'most_downloaded') sortOption = { 'stats.downloads': -1 };
    if (sort === 'highest_rated') sortOption = { 'stats.averageRating': -1 };
    if (sort === 'most_viewed') sortOption = { 'stats.views': -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('uploadedBy', 'name email avatarUrl level points')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Resource.countDocuments(query),
    ]);

    return res.json({
      success: true,
      message: 'Resources fetched successfully',
      data: {
        items: resources,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/resources/:id
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email avatarUrl level points');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
        error: { code: 'RESOURCE_NOT_FOUND' },
      });
    }

    // Increment view count asynchronously
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { 'stats.views': 1 } });

    return res.json({
      success: true,
      message: 'Resource details retrieved',
      data: { resource },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resource',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// POST /api/v1/resources
exports.createResource = async (req, res) => {
  try {
    const { title, description, category, branchId, semesterId, subjectId, unitNumber, tags, file } = req.body;

    if (!title || !description || !category || !branchId || !semesterId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: 'Required resource metadata is missing',
      });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const resource = await Resource.create({
      title,
      slug: `${slug}-${Date.now()}`,
      description,
      category,
      branchId,
      semesterId,
      subjectId,
      unitNumber: unitNumber ? Number(unitNumber) : undefined,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      file: file || {
        url: 'https://example.com/demo.pdf',
        originalName: `${title}.pdf`,
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 1024 * 1024 * 2,
      },
      uploadedBy: req.user._id,
      status: 'PUBLISHED',
    });

    // Reward XP (+10 XP for approved upload)
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });

    return res.status(201).json({
      success: true,
      message: 'Resource published successfully',
      data: { resource },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resource',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/resources/:id/download
exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Increment downloads count
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { 'stats.downloads': 1 } });

    return res.json({
      success: true,
      message: 'Download initiated',
      data: { downloadUrl: resource.file.url },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to process download' });
  }
};
