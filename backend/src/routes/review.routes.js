const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// Public route to view reviews
router.get('/menus/:menuId/reviews', ReviewController.getMenuReviews);

// Authenticated route to add review
router.post(
  '/menus/:menuId/reviews',
  authMiddleware,
  validate(ReviewController.addReviewSchema),
  ReviewController.addReview
);

// Authenticated route to delete review (User who made it or Admin)
router.delete('/reviews/:id', authMiddleware, ReviewController.deleteReview);

module.exports = router;
