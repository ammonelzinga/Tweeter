# Milestone #4 Tables

## Following (Followees)

UI: Followees tab
DB read: Get the **followee** fo given user, N(page number like 10) at a time

Table: follows
Key:
    *Partition key: follower_handle
    *Sort key: followee_handle

    we are using the composite primary key (partition and sort key paired together) because there is a unique table item for a pair of follower and followee

Question: How to get the full name and profile image?
    Do a query that just gets the alias and handle
    Then do a second query on the User table to get back list of full names and profile images
        Look at the visitorDAO.ts file for a method that use "BatchGetCommand" to make this more efficient
    


## Followers

UI: Followers tab
DB read: Get the **followers** of given user, N(page size like 10) at a time

Table: follows_index (a global seocndary index of the above table) its just the dynamo built in index functionality to get this "second table" just like the exercise
Key: 
    * Partition Key: followee_handle
    * Sort key: follower_handle

Implementation is the same as followees, use BatchGetCommand


## Users

UI: Login screen
DB read: Get the FullName and Profile Image of given user, N at a time

Table: Users
Key:
    Partition key: handle
Attribute:
    fullname
    ProfileImage

No Sort Key required because each user will only have one fullName and profileImage



## Story

UI: Story page
DB read: Get the personal **Status** of given user, N at at time, sorted from newest to oldest. So it's just a list of posts that a User has created

Table: Story
Key:
    * Partition key: handle of the author
    * Sort key: time stamp (milliseconds from 1970 but I think you can just use some built in date time stamp method with typescript)
Attribute: 
    *Status

You just need to simply do a query on the Story table with a userAlias (handle) and timeStamp

## Feed

UI: Feed page
DB read: Get status for followees of a given user N at a time, newest to oldest

Table: Feed
Key:
    * Partition key: handle of the feed owne (not the status author)
    * Sort key: time stamp (milliseconds from 1970)
Attribute: 
    * handle of the status author
    * status? You can choose whether or not to include the actual status here or not. 

every time someone makes a post, you need to update their story and then update the feed of everyone who follows them

You don't have to do any retroactive updates. So if you unfollow someone, you don't need to delete their posts from your feed. When you follow someone, you don't get to see that person's old posts.

## Session

UI: "A signed in user..."
DB read: Get item for authToken passed to you

Table: AuthTokens
Key:
    *Partition key: auh token: string,
Attribute: 
    * handle
    * DateTime (Last Time this user has done anything with the server with this authtoken)

Update the datetime attribute every time the user does anything with the server

SUGGESTIONS
    You can look into some dynamo "time to live" feature to help you, optional


