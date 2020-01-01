/**
 * API endpoints:
 * /latest
 * /months
 * /months/December+2019/posts
 */

const router = require('express').Router();
const whoishiring = require('../../services/whoishiring');

function send405Status(allowed = 'GET') {
  return (req, res) => {
    res.set('Allow', allowed);
    res.sendStatus(405);
  };
}

router
  .route('/latest')
  .get(async (req, res) => {
    const posts = await whoishiring.getPostsByMonth('latest');
    const months = await whoishiring.getListOfMonthLabel();

    res.status(200).json({
      page: 1,
      postsTotal: posts.length,
      postsPerPage: posts.length,
      months,
      posts,
    });
  })
  .all(send405Status());

router
  .route('/months/:month/posts')
  .get(async (req, res) => {
    const { month } = req.params;
    const posts = await whoishiring.getPostsByMonth(month);

    if (posts.length === 0) {
      req.log.error({ month }, 'month not found for /months/:month/posts');
      return res.sendStatus(404);
    }
    res.status(200).json({
      page: 1,
      postsTotal: posts.length,
      postsPerPage: posts.length,
      posts,
    });
  })
  .all(send405Status());

router.route('/months/:month').all((req, res) => res.sendStatus(400));

router
  .route('/months')
  .get(async (req, res) => {
    const labels = await whoishiring.getListOfMonthLabel();
    res.status(200).json(labels);
  })
  .all(send405Status());

module.exports = router;
