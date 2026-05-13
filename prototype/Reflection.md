# Wildspot Prototype Reflection

## Prototype Implementation - Jianhao Zhang

For my prototype implementation, I worked on testing whether the Wildspot app could send user-created content from the frontend to the backend server. The main goal was not to build the complete final app, but to prove that our architecture can support communication between the UI, backend server, file storage, and database.

The part I focused on was the upload flow. In our Figma design, the Upload screen allows users to add an animal photo or video, choose an animal category, write a caption, add hashtags, and select location privacy settings. For the prototype, I simplified this flow but kept the most important part: the user can choose an image, enter an animal category, write a caption, and press Share.

When the user presses Share, the frontend sends the image file and post information to the backend server. The backend receives the image, saves it into a local `uploads/` folder, and stores the post information in a SQLite database. The database does not store the actual image file. Instead, it stores the image path as `media_url`.

This proves that the app can send data and image files to the server.

---

## Architecture Flow Demonstrated

The prototype demonstrates this main architecture flow:

```text
Frontend Upload Screen
→ HTTP POST request with FormData
→ Express backend server
→ Multer receives and saves the image file
→ SQLite database stores post data and image path
→ Backend returns JSON response
→ Frontend can retrieve saved posts again
```

This connects to our larger Wildspot architecture because the final app also needs users to upload animal sightings, store those sightings, and display them later on the map or profile pages.

---

## Components Used in the Prototype

### Frontend UI

The frontend is built using React Native / Expo. It includes a simplified version of the Wildspot interface based on our Figma design. The prototype includes screens such as Map, Upload, Profile, and Chat, but the main working part is the Upload screen.

The Upload screen allows the user to:

- choose an image
- enter an animal category
- write a caption
- press Share to send the post to the backend

### Backend Server

The backend uses Node.js and Express. It handles API requests from the frontend.

The main backend endpoint used in the prototype is:

```text
POST /api/posts
```

This endpoint receives the uploaded image and post information.

The backend also supports:

```text
GET /api/posts
```

This endpoint returns the saved animal posts as JSON.

### File Storage

For this prototype, uploaded images are saved locally in the backend project’s `uploads/` folder.

This means the image file is stored on the server side. In a future version, this local folder could be replaced by Firebase Storage.

### Database

The prototype uses SQLite. The database stores structured post information, such as:

- animal category
- caption
- approximate location
- media URL / image path

The database stores the image path, not the actual image file.

Example:

```json
{
  "animal_category": "Dog",
  "caption": "Found a dog near Mason Park",
  "media_url": "/uploads/animal.jpg",
  "approximate_location": "Mason Park area"
}
```

---

## Why This Prototype Matters

This prototype is important because Wildspot depends on user-generated posts. If users cannot send animal photos and post information to the server, then the main app idea would not work.

By building this prototype, I proved that:

- the frontend can send data to the backend
- the frontend can send an image file to the backend
- the backend can receive and store the image
- the database can store the related post information
- the saved post data can be retrieved later through an API

This matches the architecture requirement because it shows communication between multiple components, not just a static UI.

---

## How to Run the Prototype

### Start the Backend Server

From the prototype backend folder, run:

```bash
node server.js
```

The backend runs at:

```text
http://localhost:3000
```

To check if the backend is working, open:

```text
http://localhost:3000/api/posts
```

This should show saved posts in JSON format.

### Start the Frontend UI

From the frontend folder, run:

```bash
cd wildspot-ui
npm start
```

Then open the web version:

```text
http://localhost:8081
```

---

## Demo Evidence

To demonstrate the prototype:

1. Open the Wildspot UI.
2. Go to the Upload screen.
3. Select an image.
4. Enter an animal category, such as `Dog`.
5. Enter a caption, such as `Found a dog near Mason Park`.
6. Press Share.
7. Check the backend `uploads/` folder to see that the image file was saved.
8. Open `http://localhost:3000/api/posts` to see the saved post data and `media_url`.

If the image appears in the `uploads/` folder and the API response includes a `media_url`, then the prototype successfully proves that the app can send images to the server.

---

## What I Learned

Through this prototype, I learned that uploading images is different from sending normal text data. For normal text-based data, the frontend can send JSON. However, image files need to be sent using `FormData`. This allows the frontend to send both text fields and a file in the same request.

I also learned that the frontend should not directly access the database. Instead, the frontend sends requests to the backend server. The backend is responsible for receiving the request, storing the image, writing data into the database, and returning a response.

Another important thing I learned is that a SQL database should not directly store large image files. It is better to store the image file somewhere else and store only the image path or URL in the database.

---

## Challenges Encountered

One challenge was understanding where the uploaded image was actually stored. At first, it was confusing because the database does not show the image itself. After testing, I understood that the image is stored in the backend `uploads/` folder, while SQLite only stores the path to the image.

Another challenge was connecting the frontend image picker to the backend upload route. The frontend had to use `FormData`, and the backend needed Multer to receive the file. This was different from the earlier version of the prototype, where the app only sent normal JSON data.

A third challenge was making sure the frontend and backend were both running at the same time. The frontend runs through Expo, while the backend runs separately with Node.js. Both parts need to be running for the prototype to work correctly.

---

## Future Improvements

In a future version, the local `uploads/` folder could be replaced with Firebase Storage. This would be better for a real mobile app because uploaded images would be stored in the cloud instead of only on one local machine.

The prototype could also be improved by:

- showing the uploaded image directly on the Map or Post Detail screen
- adding real user accounts
- storing hashtags in a separate tags table
- supporting real location data
- using Firebase Storage for media files
- adding better error handling for failed uploads

---

## Summary

Overall, this prototype shows that Wildspot’s basic architecture can work. The UI can send an image and post information to the backend server, the server can store the image file, and the database can save the related post data. This supports the main architecture idea for Wildspot because the app depends on users uploading animal sightings and retrieving them later.
```
