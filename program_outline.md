# Wildspot Requirements Specification

## 1. System Overview

Wildspot is a mobile app that helps users discover and share nearby animal sightings. Instead of a traditional social media app, it focuses more on location and real-world exploration. Users can view animal posts on a map, upload their own sightings, and interact with others nearby.

The app also considers safety and privacy by using features like approximate location and delayed posting, so users are not sharing their exact real-time location.

---
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
