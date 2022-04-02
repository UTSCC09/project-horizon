# Project Horizon

## Project URL: [horizon.mohamedhalat.com](https://horizon.mohamedhalat.com)

## Project Video URL

**Task:** Provide the link to your youtube video. Please make sure the link works.

## Table of Contents
- [Project Horizon](#project-horizon)
  - [Project URL: horizon.mohamedhalat.com](#project-url-horizonmohamedhalatcom)
  - [Project Video URL](#project-video-url)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Development](#development)
    - [Stack](#stack)
  - [Deployment](#deployment)
  - [Maintenance](#maintenance)
  - [Challenges](#challenges)
  - [Contributions](#contributions)
- [One more thing?](#one-more-thing)

## Project Description

**Task:** Provide a detailed description of your app

A social network for game developers and 3d artists. Works similar to most social networks and allows posting, commenting, liking, user feeds, private messaging, and more.
The key feature is the ability to create and share 3d models.

Additionally, we want to be heavily feed and friend focused. So when you first register for the app you can subscribe to friends feeds and see an aggreated feed of all your friends activities (or view independent feeds).
Then, we want a messaging system that also allows you to create DM to your friends.

## Development

<!-- **Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. -->

### Stack
Our techstack relies on NodeJS on both the front and backend. We decided to use Angular for the frontend library because of it's simplicity
and NestJS, Postgresql and Apollo for the backend because of their GraphQL support.
- Frontend:
  - Angular
  - Libraries:
    - Three.js: WebGL library for rendering 3d graphics
    - PrimeNg & Bootstrap: UI library
    - Apollo: GraphQL api library
- Backend:
  - Nest.js
    - Apollo: GraphQL driver
    - Sentry: Error Monitoring
    - TypeORM: ORM for Postgresql
    - Terminus: API health check
  - DB: Postgresql
  - Cache: Redis (also used as a cross pod pub/sub)
  - Auth: Passport.js/JWT

## Deployment
<!-- **Task:** Explain how you have deployed your application.  -->

Kubernetes on Google cloud platform

## Maintenance
<!-- **Task:** Explain how you monitor your deployed app to make sure that everything is working as expected. -->

- Github build actions to ensure a PR doesn't break building
- Github CI/CD for continuous deployment off of main (didn't work because of cost issue)
- GCP Monitoring Tools: Error Reporting (mostly on mobile)
- Sentry backend monitoring




## Challenges

<!-- **Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. -->

1. Deployment
2. 3D Engine
3. Long Polling

## Contributions
<!-- **Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).  -->

Basic, elaborate.

- Ahmed
  - 3D engine
  - Adding Posts
  - Redis integration/deployment
  - Github Build Actions
  - Notification System
- Mohamed
  - Figuring out basic backend architecture (typeorm + gql)
  - Auth
  - Deployment
  - Comments
  - Liking
  - Following

# One more thing?

**Task:** Any additional comment you want to share with the course staff?
