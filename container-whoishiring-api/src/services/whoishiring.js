const db = require('../models');

// const POSTS_PER_PAGE = 50;
module.exports = {
  async getListOfMonthLabel({ attributes, limit } = {}) {
    const months = await db.stories.findAll({
      attributes,
      order: [['postedDate', 'ASC']],
      limit,
    });
    return months.map((month) => month.label);
  },
  async getLatestMonthLabel() {
    const res = await this.getListOfMonthLabel({
      attributes: ['label'],
      limit: 1,
    });
    return res[0];
  },
  async getPostsByMonth(monthLabel /*, page=1 */) {
    if (monthLabel === 'latest') {
      monthLabel = await this.getLatestMonthLabel();
    }

    // TODO: add index by monthId/monthLabel?
    return db.posts.findAll({
      attributes: ['id', 'author', 'body', 'postedDate', 'remoteFlag', 'onsiteFlag', 'internsFlag', 'visaFlag'],
      // offset: (page-1) * POSTS_PER_PAGE,
      // limit: POSTS_PER_PAGE,
      order: [['postedDate', 'DESC']],
      include: [
        {
          model: db.stories,
          as: 'story',
          where: { label: monthLabel },
          attributes: [],
        },
      ],
    });
  },
};
