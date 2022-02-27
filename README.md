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
A social network for game developers and 3d artists. Works similar to most social networks and allows posting, commenting, liking, user feeds, private messaging, and more. The key feature is the ability to create and share 3d models.

## Beta Version Key Features
- [ ] Registration
- [ ] Posting
- [ ] Commenting
- [ ] User Feeds
- [ ] Adding Friends
- [ ] Preview post Content

## Final Version Features
- [ ] Searching
- [ ] Aggregate Feed
- [ ] Snapshots of 3d content
- [ ] Clean UI

## Stack
- Frontend:
  - Vue.js
  - Compiler: Vite
  - Libraries:
    - Three.js (WebGL library for rendering 3d graphics)
    - Vuetify (UI library)
    - Pinia (Storage)
- Backend:
  - Nest.js
  - DB: Elasticsearch
  - Auth: Passport.js/JWT

## Top 5 Technical Challenges
1. Creating and storing snapshots of 3d models to be used while looking at your feed. These are then changed to rendered models on preview.
2. Displaying actual 3d models in an interactive way.
3. Automatic updates of the feed using websockets.
4. Searching for users and posts.
5. Private messaging.

