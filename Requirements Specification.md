WILDSPOT

Contributors: 

Matthew Contreras (mtcontr2)
Dominic Diaz (domind5)
Quan Nguyen (quankn)
Jianhao Zhang (jianhz4)
Niki Chen Chen (nchenche)


# **1\. Executive Summary**

Objective

Our program, Wildspot, is a mobile app available to both IOS and Android that offers a new social media platform where users can post photos and videos of wild animals, and interact with other animal lovers in their area through posts and chatrooms. Through this platform, we aim for animal-loving communities to be able to connect without the constant concern of their safety.

The Problem

The safety of our users is a top priority. Recently, certain social media platforms are facing lawsuits because of its feature being used by predators to locate and track children. The frustration of users having to constantly find the right app to connect with others while simultaneously having their personal information secure calls for a new platform that can guarantee all of their needs.

The Proposed Solution

To prevent any harm to our users, Wildspot consists of several privacy features, such as preventing users’ posts from being uploaded immediately. This feature prevents any images or videos that violate our policy. Additionally, our users can choose the option to appear anonymous. Our chat box feature allows users to interact with users in their area. Once they leave the area, all of their chat histories will be hidden. This prevents users from having unwanted digital footprints. We are dedicated to safety features and moderation to ensure all users get the best experience with our app.

Key Features
- Geolocation map
- Delay in publishing posts or videos
- Tag animals
- Users can create/join chatrooms near their location

Obstacles
- Prevent & filter misleading content
- Inappropriate use of the app 


# **2\. Application Context / Environmental Constraints**

* Platform: Mobile (iOS and Android)  
* Device: Smartphones, tablets with a clear camera and GPS function  
* Dependencies:  
  * Location services (GPS) and camera  
  * Requires a stable internet connection (for posting and viewing content)  
* Constraints:  
  * Must handle privacy concerns related to geolocation  
  * Must limit real-time tracking capabilities  
  * Designed for public outdoor environments

# **3\. Functional Requirements**

1. # **Map-Based Discovery:**

* The system should display a map interface showing nearby animal sighting records.  
* The system should represent each post as a thumbtack on the map.  
* The system should allow users to click on the pins to view post details.  
* The system should refresh map data periodically or upon user request.

2. ## **Image Posting System**

* The system should allow users to upload images.  
* The system should allow users to add text descriptions.  
* The system should allow users to add tags (e.g., \#dog, \#bird).  
* The system should include geolocation information for each post.  
* The system should support delayed release functionality (e.g., 10–60 minutes).  
* The system should support the use of approximate locations, rather than precise coordinates.

3. **Hashtags / Interests**

* The system should allow users to categorize posts using tags.  
* The system should allow users to filter map results based on tags.  
* The system should support predefined animal categories.

4. **Nearby Chat (Transient)**

* The system should allow users to chat with other nearby users.  
* The system should restrict the visibility of chats to users within a specific geographic area.  
* The system should automatically delete/hide chat history after a certain period of time, or when the user leaves the area (unless the other user has marked the chat history as a friend).


5. ## **User Profiles**

* The system should allow users to create profiles.  
* The system should display users' posts in a grid format on their profile pages.  
* The system should allow users to set account visibility (public/private).


6. **Privacy & Safety Controls**

* The system should allow users to:  
  * Enable/disable location sharing  
  * Use an approximate location rather than a precise location  
  * Delay publication time  
* The system should prevent real-time, precise tracking.  
* The system should include a reporting feature for unsafe content or users.

7. ## **Animal Tagging (Custom Feature)**

* The system allows users to add tags to animals (e.g., dog, duck, deer).  
* The system will display icons representing different animals on the map.

# **4\. Functional Requirements Analysis (Pros, Cons, Ethics)**

## 

1. ## **Map-Based Discovery**

* Pros:  
  * Easy to visualize nearby activity  
  * Encourages exploration  
* Cons:  
  * Can reveal patterns of user movement  
* Ethical Concern:  
  * Potential misuse for tracking users  
    * mitigated by approximate/delayed location

2. ## **Image Posting**

* Pros: Engaging and content-driven  
* Cons: Risk of inappropriate or misleading content  
* Ethical Concern: Need a moderation/reporting system

3. ## **Hashtags**

* Pros: Improves discoverability  
* Cons: Can be misused or spammed   
* Ethical Concern: May need moderation for harmful tags

4. ## **Nearby Chat**

* Pros: Enables real-time interaction  
* Cons: Risk of harassment  
* Ethical Concern: Must include reporting/blocking and limit persistence

5. ## **Privacy Controls**

* Pros: Protects users from stalking  
* Cons: Reduces the accuracy of the location  
* Ethical Concern: Critical feature to prevent harm \= MUST be implemented

6. ## **Animal Tagging**

* Pros: Improves user experience and organization  
* Cons: Users may mislabel animals  
* Ethical Concern: Low risk

# **5\. Use Cases**

## **1: Upload Animal Post**

### **Basic Flow:**

1. User opens the upload screen  
2. User selects or takes a photo  
3. User adds caption and hashtags  
4. User submits post  
5. The system stores posts and displays them on a map

   ### **Alternative Flow:**

* User skips caption or hashtags

  ### **Exception Flow:**

* Upload fails due to no internet, and the system shows an error message

## **2: View Map**

### **Basic Flow:**

1. User opens the map  
2. System displays nearby pins/sorted by recent or all  
3. User taps a pin  
4. System shows post details: location & time & description.

   ### **Alternative Flow:**

* User filters by hashtag

  ### **Exception Flow:**

* No posts are available for that area, and the system displays an empty state

## **3: Chat Nearby**

### **Basic Flow:**

1. User enters chat screen  
2. System shows nearby users/messages  
3. User sends a message.  
4. User leaves the area, and the chat history gets deleted/hidden.

   ### **Alternative Flow:**

* User joins existing conversation

  ### **Exception Flow:**

* No nearby users, and chat is disabled

## **4: Manage Privacy Settings**

### **Basic Flow:**

1. User opens settings  
2. User enables delayed posting  
3. User selects approximate location  
4. System applies settings

   ### **Alternative Flow:**

* User disables location sharing

  ### **Exception Flow:**

* Invalid setting, and the system rejects the change

## **5: Overall Architectural Summary**
WildSpot will be a minimalist, animal-themed app, fitting with our goal to deliver local animal sightings to all. It will use a Client-Server architecture with a component-based MVC frontend, in order to maximize modularity and enable real-time communication between the client and the server. All communication will be through HTTPS requests, which integrate seamlessly into our React Native app, JavaScript server, and Firebase database. 

Our backend server will be a layered system running on a consumer-grade computer and regulated by an input/output layer, on top of the business logic layer, on top of our Firebase storage system. This divides the responsibilities of our server between each layer, and the inclusion of Firebase allows us to easily store and retrieve images and locational information, which will be vital for our app.
	
## **6: Platforms and Programming Languages**
Our app will be primarily made for IOS mobile devices, as they are the single largest category of mobile device and sport a rich integrated ecosystem of development tools. Mobile development is more limited in many ways than a web or computer-based application would be, but fitting with the theme of the project, a mobile app is far more accessible and comparatively frictionless to use for our future users. 

By using React Native, our app will be able to seamlessly be ported into the Android app store as well, and benefit from tools like Expo Go to quickly compile and run our app during development. One downside of this is losing Swift’s complete integration with Apple products, but this is more than made up for by our requirement as a social app to be accessible from every mobile device. Sticking with Swift will lock us into IOS, while React Native provides the flexibility to fulfill our requirements.

Our server is designed to be lightweight, able to run on consumer-grade laptops and computers instead of any specific costly commercial server rack. This will give us the flexibility to bring our server with us, make updates and changes quickly, while still maintaining the ability to move to a more powerful system as our user base grows. For the planned layered integration with Firebase, the server will run JavaScript, specifically Next.js for maximum integration with our database. One additional advantage is that Next.js is already built on top of React, which increases the language consistency of our app and makes future development and debugging easier.

A strong alternate contender was Angular, which has many of the same advantages as Next.js – including long-term stability and a strict, reliable architecture – while also offering a specialized third person Angularfire library. However, we ultimately decided to go with Next.js for its flexibility and ease of use for the small app we had in mind.

For databases, we needed something that could handle both location data and large quantities of user images. Firebase was the only real contender. Alternatives like Supabase or direct Google Cloud storage simply did not have the out-of-the-box integration that Firebase offered, or lacked the generous free storage limits WildSpot needed. While our team was more familiar with database software like SQLite, it lacks the efficient image storage and built-in image processing tools Firebase offers. As a cloud storage provider, Firebase was exactly what we needed.

## **7: Communication Protocols**

WildSpot plans to use two primary protocols to handle communication between its components: HTTPS for client-server communication, and TCP for internal server-to-database communication.

All communication between the mobile client and the backend is intended to pass through HTTPS. This applies to every core feature — loading posts, uploading sightings, managing profiles, submitting reports, and saving posts. HTTPS was chosen because it is natively supported on both iOS and Android, integrates well with React Native and Next.js, and provides the encryption needed to protect user location data and credentials in transit. Each request would follow a standard REST pattern: the client sends a request with a method (GET, POST, PUT, DELETE), the server processes it and returns a JSON response with an appropriate status code (200, 201, 404, 500).

Internally, the backend services would communicate with Firebase over TCP. Firebase uses its own wire protocol built on top of TCP connections, which provides reliable reads and writes to our cloud database and media storage. When the frontend requests post data, the backend would query Firebase via this TCP connection and assemble the response before returning it to the client over HTTPS. Media files such as photos and videos would be fetched directly from Firebase Storage via HTTPS using a media URL returned by the backend, so large files would not need to pass through the application server itself.

For the nearby chat feature, WildSpot intends to use WebSockets rather than HTTPS. Unlike REST, which requires the client to repeatedly ask the server for new data, WebSockets maintain a persistent TCP connection that allows the server to push new messages to the client instantly. This would be particularly useful for real-time chat. When a user enters a nearby chat area, a WebSocket connection would be opened. Messages would be transmitted in both directions over this connection until the user leaves the area, at which point the connection would be closed and the chat history cleared from Firebase.



## **8: Examples of Component Functions and Connector Communications**

### **Use case 1: View post Details**

### **User taps a post pin**

- Step 1 - User taps filter button → MapScreen.openFilterPanel() → updates local state { filterOpen: true }

- Step 2 - Frontend renders filter UI → MapScreen.renderFilterOptions() → displays search bar, animal type options, radius selector

### **System loads post details**

- Step 1 - Frontend requests post → PostDetailsScreen.loadPostDetails(postId) → db.collection("posts").doc("p_001").get()

- Step 2 - Firebase returns document → Database → { id, caption, mediaUrl, animalType, location, createdAt } returned to Post Service

- Step 3 - Backend responds → PostService.buildPostResponse() → 200 { postId, caption, mediaUrl, animalType, postedAt } over HTTPS to frontend

- Step 4 - PostDetailsScreen.setLoading(false) → displays loading state while fetching

### **System shows media and caption**

- Step 1 - Backend returns post data → PostService.buildPostResponse() → { postId, caption, mediaUrl, tags, animalType }

- Step 2 - Frontend fetches media → PostDetailsScreen.loadMedia(mediaUrl) → fetches image/video from media storage via HTTPS

- Step 3 - Frontend renders →  PostDetailsScreen.setPost(postData) → renders image/video, caption, and tags on screen

### **User views comments**

- Step 1 - Frontend requests comments → PostDetailsScreen.loadComments(postId) → db.collection("posts").doc("p_001").collection("comments").get()

- Step 2 - Firebase returns documents → Database → [{ commentId, userId, text, createdAt }] returned to Comment Service

- Step 3 - Backend responds → CommentService.buildCommentsResponse() → 200 [{ commentId, username, text, createdAt }] over HTTPS to frontend

- Step 4 - Frontend renders → PostDetailsScreen.setComments(comments) → renders each comment as username + text + timestamp

### **Post is unavailable**

- Step 1 - Firebase returns nothing → Database → document does not exist, returns null to Post Service

- Step 2 - Backend responds → PostService.handleNotFound() → 404 { error: 404, message: "Post not found or has been removed" } over HTTPS to frontend

- Step 3 - Frontend shows error → PostDetailsScreen.setError(message) → renders "This post is no longer available"


### **Use case 2: Filter Animal Sightings**

### **User opens filter/search**

- Step 1 - User taps filter button → MapScreen.openFilterPanel() → updates local state { filterOpen: true }

- Step 2 - Frontend renders filter UI → MapScreen.renderFilterOptions() → displays search bar, animal type options, radius selector

### **User enters animal type or hashtag**

- Step 1 - User types in the search bar
MapScreen.onFilterChange(input) → { tag: "deer" } stored in local state

- Step 2 - Frontend updates UI → MapScreen.setFilterInput(value) → highlights selected animal type, enables Apply button

### **User applies filter**

- Step 1 - User taps Apply  → MapScreen.applyFilters(filters) → db.collection("posts").where("animalType", "==", "deer").get()

- Step 2 - Firebase returns documents → Database → [{ id, mediaUrl, animalType, lat, lng }] returned to Map Service

- Step 3 - Backend responds → MapService.buildFilteredPostList() → 200 [{ postId, lat, lng, animalIcon, caption }] over HTTPS to frontend

- Step 4 - Location service provides coords → Device GPS → { lat: 33.6, lng: -117.8 } sent to Map Service for radius filtering

### **System returns matching posts**

- Step 1 - Backend returns filtered list → MapService.buildFilteredPostList() → [{ postId: "p_002", lat: 33.61, lng: -117.79, animalIcon: "deer" }]

- Step 2- Frontend re-renders map → MapScreen.setFilteredPosts(posts) → clears old pins, places animal icon at each coordinate

### **No results found**

- Step 1- Firebase returns nothing → Database → empty query snapshot returned to Map Service

- Step 2 - Backend responds → MapService.handleEmptyFilterResult() → 200 { posts: [], message: "No sightings found in this area" } over HTTPS to frontend

- Step 3 - Frontend shows empty state → MapScreen.setFilteredPosts([]) → clears all pins, renders "No sightings found in this area"


### **Use case 3: Manage Profile:**
### **User opens profile screen**
- Step 1 - User opens profile tab → ProfileScreen.openProfileScreen() → Navigates to profile view with { userId: “u_42” }

### **System loads profile data**
- Step 1 - Frontend requests profile → ProfileScreen.loadProfile(userId) → db.collection(“users”).doc(“u_42”).get() 

- Step 2 - Firebase returns document → Database → { id, username, bio, avatarUrl, isPrivate } returned to User Service

- Step 3 - Backend responds → UserService.buildProfileResponse() → 200 { userId, username, bio, avatarUrl, posts: [] } over HTTPs to frontend

- Step 4 - Frontend renders → ProfileScreen.setProfile(profileData) → renders avatar, username, bio, post grid

### **User edits profile**
- Step 1 - User taps edit button → ProfileScreen.openEditForm() → pre-fills form with { username, bio, avatarUrl } from local state 

### **User saves changes**
- Step 1 - User submits edit form → ProfileScreen.saveProfile(updatedProfile) → db.collection(“users”).doc(“u-42”).update({bio: “Updated bio”, avatarUrl: “ “ })

- Step 2 - Firebase confirms write → Database → write success returned to User Service 

- Step 3 - Backend responds → UserService.buildUpdateResponse() → 200 {success: true, updatedAt: “(date)” } over HTTPs to frontend

- Step 4 - Frontend confirms → ProfileScreen.setProfile(updatedData) → closes edit form, re-renders profile with new data

### **Save fails**
- Step 1 - Firebase write fails → Database → permission denied or network error returned to User Service

- Step 2 - Backend responds → UserService.handleUpdateError() → 500 { error: 500, message: “Failed to save changes. Please try again.” } over HTTPS to frontend

- Step 3 - Frontend shows error → ProfileScreen.setError(message) → keeps edit form open, shows error message

### **Use case 4: Report user or Post**

### **User opens report option**
- Step 1 - User taps report button → ReportModal.openReportMenu() → {targetId: “p_001”, targetType: “post” } stored in local state

### **User submits report**
- Step 1 - User taps submit → ReportModal.submitReport(reportData) → db.collection(“reports”).add({ reporterId: “u_42”, targetId: “p_001”, targetType: “post”, reason: “inappropriate_content” })

- Step 2 - Firebase confirms write → Database → new document created, returns {reportId: “r_001” } to moderation service

- Step 3 - Backend responds → ModerationService.buildReportConfirmation() → 201 { success: true, reportId: “r_001” } over HTTPS to frontend

### **System confirms report**
- Step 1 - Backend returns success → ModerationService.buildReportConfirmation() → { success: true, reportId: “r_001” }

- Step 2 - Frontend confirms → ReportModal.setReportSubmitted(true) → closes modal, shows toast “Report submitted”

### **Report fails**
- Step 1 - Firebase write fails → Database → permission denied or network error returned to Moderation Service

- Step 2  - Backend responds → ModerationService.handleReportError() → 500 { error: 500, message: “Report could not be submitted” } over HTTPs to frontend

- Step 3 - Frontend shows error → ReportModal.setError(message) → keeps modal open, shows error message

### **Use case 5: Manage Saved Posts **

### **User taps save icon**

- Step 1 - User taps save icon → SavedPostButton.onSaveTap() → immediately sets local state { postId: “p_003”, saved: true } (optimistic update) 

### **System saves post**

- Step 1 - Frontend sends request → SavedPostButton.savePost(userId, postId) → db.colelction(“users”).doc(“u_42”).collection(“savedPosts”).doc(“p_003”).set({savedAt: now })

- Step 2 - Firebase confirms write → Database → write success returned to Post Service 

- Step 3 - Backend responds → PostService.buildSaveConfirmation() → 201 { success: true, savedAt: “date” } over HTTPS to frontend 

### **User opens saved tab**

- Step 1 - Frontend requests saved posts → SavedPostsScreen.loadSavedPosts(userId) → db.collection(“users”).doc(“u_42”).collection(“savedPosts”).get()

- Step 2 - Firebase returns documents → Database → [{ postId, mediaUrl, caption, savedAt }] returned to Post Service

- Step 3 - Backend responds → PostService.buildSavedPostsList() → 200 [{ postId, mediaUrl, caption }] over HTTPs to frontend

- Step 4 - Frontend renders → SavedPostsScreen.setSavedPosts(posts) → renders post thumbnails in grid layout

### **User unsaves post**

- Step 1 - User taps save icon again → SavedPostButton.onUnsavetap() → immediately sets local state { postId: “p_003”, saved: false } (optimistic update)

- Step 2 - Frontend sends request → SavedPostbutton.unsavePost(userId, postId) → db.collection(“users”).doc(“u_42”).collection(“savedPosts”).doc(“p_003”).delete()

- Step 3 - Firebase confirms deletion → Database → Delete success returned to Post Service

- Step 4 - Backend responds → PostService.buildDeleteConfirmation() → 200 { success: true } over HTTPS to frontend

### **Save action fails**

- Step 1 - Firebase write fails → Database → permission denied or network error returned to Post Service

- Step 2 - Backend responds → PostService.handleSaveError() → 500 { error: 500, message: “Unable to update saved posts” } over HTTPS to frontend

- Step 3 - Frontend reverts → SavedPostButton.setError(message) → reverts saved state, shows error toast


Prototype



