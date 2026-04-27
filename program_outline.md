# Wildspot Requirements Specification

## 1. System Overview

Wildspot is a mobile app that helps users discover and share nearby animal sightings. Instead of a traditional social media app, it focuses more on location and real-world exploration. Users can view animal posts on a map, upload their own sightings, and interact with others nearby.

The app also considers safety and privacy by using features like approximate location and delayed posting, so users are not sharing their exact real-time location.


## 2. Main System Components

The system includes the following main parts:

- Map system (shows nearby posts)
- Post system (stores and manages posts)
- Upload system (handles creating new posts)
- Tag and filter system (helps users search)
- Chat system (for nearby communication)
- Profile system (user info and posts)
- Privacy system (controls location sharing)
- Reporting system (handles unsafe content)

---

## 3. UI Structure

### Map Screen
This is the main screen where users can see nearby animal posts on a map. It also allows searching and filtering.

### Post Detail Screen
Shows the full details of a post, including the image, caption, tags, and approximate location.

### Upload Screen
Allows users to create a post by adding media, tags, captions, and privacy settings.

### Profile Screen
Displays user information and their posts.

### Nearby Chat Screen
Allows users to chat with others nearby. Messages are temporary and will expire.

---

## 4. Functional Requirements

### 4.1 Map-Based Discovery
- The system shall display nearby posts on a map.
- The system shall show each post as a pin.
- Users shall be able to tap a pin to view details.
- The system shall allow filtering and searching.
- The system shall refresh data periodically.

### 4.2 Post Management
- The system shall store posts with media, captions, tags, and location.
- Each post shall be linked to a user.
- Posts shall be visible on the map and in profiles.
- The system shall support delayed posting.
- The system shall avoid showing exact real-time location.

### 4.3 Media Upload
- Users shall be able to upload photos or videos.
- Users shall be able to add captions and tags.
- The system shall check media before upload.
- Users shall be able to submit or cancel posts.

### 4.4 Tagging and Filtering
- Users shall be able to add hashtags.
- The system shall support animal categories.
- Users shall be able to filter by tags or keywords.

### 4.5 Nearby Chat
- Users shall be able to send messages to nearby users.
- Messages shall appear in real time.
- Messages shall expire after a period of time.

### 4.6 User Profile
- Users shall be able to create and edit profiles.
- The system shall display user info and posts.
- Users shall be able to control account visibility.

### 4.7 Location Privacy
- Users shall be able to enable or disable location sharing.
- The system shall use approximate location instead of exact coordinates.
- The system shall support delayed posting.
- The system shall prevent real-time tracking.

### 4.8 Reporting System
- Users shall be able to report posts or users.
- The system shall store reports.
- Users shall be able to block others.

---

## 5. Use Cases

### 5.1 View Nearby Posts

**Basic Flow**
1. User opens the map  
2. System shows nearby posts  
3. User taps a pin  
4. Post details are shown  

**Alternative Flow**
- User searches or filters  

**Exceptional Flow**
- Location is off → system asks user to enable it  

---

### 5.2 Upload Post

**Basic Flow**
1. User opens upload page  
2. User adds media  
3. User adds caption and tags  
4. User selects privacy settings  
5. User submits post  
6. System processes and shows the post  

**Alternative Flow**
- User chooses private/followers-only  

**Exceptional Flow**
- Upload fails due to no internet  

---

### 5.3 View Post Details

**Basic Flow**
1. User selects a post  
2. System shows full details  

**Alternative Flow**
- Access from profile  

**Exceptional Flow**
- Post not available  

---

### 5.4 Filter Posts

**Basic Flow**
1. User applies filter  
2. System updates map  

**Alternative Flow**
- Switch between recent and all  

**Exceptional Flow**
- No results found  

---

### 5.5 Nearby Chat

**Basic Flow**
1. User opens chat  
2. User sends message  
3. System displays message  

**Alternative Flow**
- Join existing chat  

**Exceptional Flow**
- No users nearby  

---

### 5.6 Manage Profile

**Basic Flow**
1. User opens profile  
2. User edits info  
3. System saves changes  

**Alternative Flow**
- Change visibility  

**Exceptional Flow**
- Save fails  

---

### 5.7 Manage Privacy

**Basic Flow**
1. User enables privacy settings  
2. System applies settings  

**Alternative Flow**
- Disable location  

**Exceptional Flow**
- Permission denied  

---

### 5.8 Report User or Post

**Basic Flow**
1. User reports content  
2. System records report  

**Alternative Flow**
- User cancels  

**Exceptional Flow**
- Report fails  


