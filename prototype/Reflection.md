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
