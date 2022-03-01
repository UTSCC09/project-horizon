# Horizon Project

## Table of Contents
- [Horizon Project](#horizon-project)
  - [Table of Contents](#table-of-contents)
  - [Members](#members)
  - [Desription](#desription)
  - [Beta Version Key Features](#beta-version-key-features)
  - [Final Version Features](#final-version-features)
  - [Stack](#stack)
  - [Top 5 Technical Challenges](#top-5-technical-challenges)

## Members
- Mohamed Halat
- Ahmed Halat

## Desription
A social network for game developers and 3d artists. Works similar to most social networks and allows posting, commenting, liking, user feeds, private messaging, and more.
The key feature is the ability to create and share 3d models.

Additionally, we want to be heavily feed and friend focused. So when you first register for the app you can subscribe to friends feeds and see an aggreated feed of all your friends activities (or view independent feeds).
Then, we want a messaging system that also allows you to create DM to your friends.
## Beta Version Key Features
The key features that we plan to build out are central to the main application, specifically posting and interacting with 3D models and
the features that allow you to get to that point.
The list of Beta Version features is as follows:
- [ ] Registration
- [ ] Posting
  - [ ] Posting 3D models
  - [ ] Interacting with posted 3D models
- [ ] Commenting
- [ ] User Feeds
- [ ] Adding Friends

## Final Version Features
For the final version of the app, we plan on building out performance and experience improving features.
This mainly includes:
- [ ] Searching
- [ ] Aggregate Feed
- [ ] Messaging system
- [ ] Snapshots of 3d content
- [ ] Clean UI

## Stack
Our techstack relies on NodeJS on both the front and backend. We decided to use Vue.js for the frontend library because of it's simplicity
and NestJS, Elasticsearch and Apollo for the backend because of their GraphQL support.
- Frontend:
  - Vue.js
  - Compiler: Vite
  - Libraries:
    - Three.js (WebGL library for rendering 3d graphics)
    - Vuetify (UI library)
    - Pinia (Storage)
    - Apollo (GraphQL api library)
- Backend:
  - Nest.js
    - Apollo (GraphQL driver)
  - DB: Elasticsearch
  - Auth: Passport.js/JWT

## Top 5 Technical Challenges
Below we have our 5 main technical challenges and the main sub-issue(s) that each one is related to.
1. Creating and storing snapshots of 3d models to be used while looking at your feed. These are then changed to rendered models on preview.
   1. We need to make sure that the snapshots are compressed enough to allow users to easily scroll through their feed without freezing.
   2. Need a way for users to quickly go from viewing a snapshot to the actual 3d model.
   3. Need to be efficient in the way we handle allocating and freeing memory of the models, so that the browser doesn't slow down and the network can handle the requests.
2. Displaying actual 3d models in an interactive way.
   1. Need to find out how to load and render 3D models on a browser window.
   2. Need to find out how to make
3. Automatic updates of the feed.
   1. We want all the data to be updated live, so that users can see the latest updates. That includes rendering commesnts, likes and other changes in real-time across all users.
4. Searching for users and posts.
   1. We need to implement a search algorithm and feature that allows users to search the DB for specific details in an efficient manner.
5. Private messaging.
   1. Need to create a message management system that allows friends to send and see old messages.

