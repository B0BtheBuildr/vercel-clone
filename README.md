# Vercel Clone

Following the instructions in the video - https://shorturl.at/fHLO1 , I have created a vercel like deployment service for React Projects (haven't tested for anything else yet).

## Project Structure

The Project itself is divided into four parts:

- Frontend - Lets you provide a URL for your github repo which you would like to deploy.
- Build Service - Fetches the repo and uploads it to an S3 Bucket.
- Deploy Service - Builds the project and reuploads to S3.
- Request Handler Service - Lets the use access the built up project.

## Libraries Used

( Apart from the ones used in the video. Writing this for people who are part of hkirat's cohort. )

- ioredis - Found it easier to use than the redis library.
- recoil - Hadn't used recoil after practicing it once, so wanted to test it out here.
- shadcn - Although its been used in the video, the tutorial was not as detailed.
- react-hook-forms - Part of the shadcn form component.

Other than that, I used aws instead of cloudflare. You are going to have to create a CORS policy to access the bucket in aws which was a new learning experience.

## Why this code along was better.

This experience of just getting a single line of instruction and having to figure out what to code first was refreshing. What I liked is the fact that as a beginner whenever I have tried to create a project, at first I do not know what the next step is. This project made me understand what the flow should look like. The coding part can be figured out with time and effort but most often beginners get stuck at figuring out how to structure the process. Sort of like cooking, as a beginner you follow a recipe and do it yourself - chopping, mixing, tossing, etc but its important to instinctively know what to do next to become a chef.
