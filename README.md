# InstaClone App

## Description

This application is a functional copy of the popular social media app called - Instagram. 

The application uses the following key technologies to build it:
* MongoDB
* Express
* React 
* NodeJs
* Tailwind

The application also relies on the following services:
* Sendgrid (Transactional Emails)
* Cloudnary (Image Hosting)
* MongoDB Atlas (Cloud Database)
* Heroku (Application Deployment)


## Functionalities

The application allows the user to do the following functions:
* Sign up/Sign in to an account 
    * User can create an email + password account and upload a profile picture during sign up
    * Passwords are hased before store during sign up
    * A welcome email is sent to the use
    * A JWT token is issued afer signing in 
* Create/Delete posts
    * Each post allows the user to add
        * A picture 
        * A caption
    * Posts will appear in the user's profile page
    * Posts will also appear in the main feed page (with posts from other users as well)
    * The user is able to delete posts as well
* Manage their profile
    * The user will see their profile name, email account and profile picture
    * The user is able to see all the posts that they have made
    * The user is able to update their profile picture
    * The user is able to see the number of followers (i.e. number of other users who are following the logged in user)
    * The user is able to see their number of following (i.e. number of other users that the logged in user is following)
* Post comments 
    * The user is able to create comments on other user posts 
    * All users will be able to see the comments made by each other on posts
* Like/Unlike posts 
    * User will be able to like posts left by other users 
    * If the user changes their mind, they are able to unlike their post (i.e. remove the like)
* Follow/Unfollow other users
    * Users are able to follow other users and see what they are posting
    * The user will be able to see all the posts made by the users they are following in a specific section
    * If the user changes their mind, they are able to unlike their post (i.e. remove the like)
* Get recommendations on users to follow
    * The users will also be suggested other users that they can follow to see their posts
* Search for users
    * The user is able to search for other registered users by the email or username


## Things we couldn't do
* Reset password
    * Allow users to reset their password by getting a link for them to enter their new password