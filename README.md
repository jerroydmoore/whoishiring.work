# whoishiring.work

Runs the [whoishiring.work](https://www.whoishiring.work).

## Getting Started for Local Development

```sh
docker-compose up --detach
cd frontend
npm install
npm run develop
```

The frontend is served at http://localhost:8000 and the backend is served at http://localhost:8080

#### Limitations
The populate-hn-data function only runs once, whereas it runs every 15 minutes in production. If you need fresher data, re-run the function locally or point your frontend to consume the production API endpoint.

## Features

This is the both the present and WIP features list. If there are features you want added or modified, open a feature request issue.

- [x] Serve HTTPS traffic, and redirect HTTP to HTTPS.
- [x] Automate populate HN data every 15 minutes.
- [x] Update URLs for each month.
- [x] Pagination.
- [x] Client-side caching.
- [ ] Deploy using terraform or cloudformation.
- [ ] Automate deployments within GitHub.
- [x] Add search capability.
- [x] Add filtering capabilities: on-site, new, noted, applied, hidden, etc.
- [x] Add sorting capabilities: posted date, popularity, view count, company.
- [ ] Add applied capabilities: each user can mark posts as "applied"
- [ ] Add notes capability: users can manage private notes per post.
- [ ] Add Ratings: users can rate each post and sort by rating
- [ ] Users can mark posts as unread and filter posts by read/unread.
- [ ] Users can hide posts, can undo hiding posts, and can filter posts by visibility.
- [ ] Save searches as culstom filters.
- [ ] Add support for boolean OR and ANDs in searches.
- [ ] Add ability to only show new posts since the last time the user visited.
- [ ] Integrate with GitHub OAuth.
- [ ] Dark Mode.


## The Production Environment

All containers run in lambda functions with a manual trigger, except the populate-hn-data lambda function which runs every 15 minutes.
The static assets from the frontend are copied into a S3 bucket with website capabilities turned on. CloudFront for this S3 website is enabled for caching and https services. The backend lambda function sits behind an API Gateway instance.

One key limitation to hosting gatsbyJS projects in S3 buckets, is Cloudfront does not redirect urls with subfolders to the subfolder's index.html. This limitation was resolved using a Lambda@Edge function with a Cloudfront trigger to redirect urls missing the index.html.

### Deploying to Production

Most items are deployed manually into AWS. This will be automated eventually.

#### Deploying the Frontend

```sh
cd ./frontend
npm run deploy
```

Note that your AWS credentials must be set in order to run the deploy script.
