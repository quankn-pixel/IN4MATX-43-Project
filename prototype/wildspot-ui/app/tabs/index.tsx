import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://localhost:3000";
// If using Expo Go on phone later, use your computer IP instead:
// const API_URL = "http://10.8.49.45:3000";

type Post = {
  id: number;
  animal_category: string;
  caption: string;
  media_url?: string;
  approximate_location?: string;
  created_at?: string;
};

export default function HomeScreen() {
  
  const [screen, setScreen] = useState("map");
  const [posts, setPosts] = useState<Post[]>([]);
  const [animalCategory, setAnimalCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  async function loadPosts() {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not load posts from server.");
    }
  }
  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert("Image selected", "The image was selected successfully.");
      } else {
        Alert.alert("No image selected", "You did not select an image.");
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Image picker error", "Could not open image picker.");
    }
  }
  async function createPost() {
    if (!animalCategory.trim()) {
      Alert.alert("Missing animal category", "Please enter an animal category.");
      return;
    }

    const formData = new FormData();

    formData.append("animal_category", animalCategory);
    formData.append("caption", caption || "New animal sighting");
    formData.append("approximate_location", "Mason Park area");

    if (selectedImage) {
      if (Platform.OS === "web") {
        const imageResponse = await fetch(selectedImage);
        const blob = await imageResponse.blob();
        formData.append("media", blob, "animal.jpg");
      } else {
        formData.append("media", {
          uri: selectedImage,
          name: "animal.jpg",
          type: "image/jpeg",
        } as any);
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Post created with image.");
        setAnimalCategory("");
        setCaption("");
        setHashtags("");
        setSelectedImage(null);
        setScreen("map");
        loadPosts();
      } else {
        Alert.alert("Error", "Post was not saved.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not upload image to backend server.");
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <View style={styles.app}>
      <View style={styles.phone}>
        {screen === "map" && (
          <MapScreen posts={posts} loadPosts={loadPosts} setScreen={setScreen} />
        )}

        {screen === "upload" && (
          <UploadScreen
            animalCategory={animalCategory}
            setAnimalCategory={setAnimalCategory}
            caption={caption}
            setCaption={setCaption}
            hashtags={hashtags}
            setHashtags={setHashtags}
            selectedImage={selectedImage}
            pickImage={pickImage}
            createPost={createPost}
          />
        )}

        {screen === "profile" && <ProfileScreen />}
        {screen === "chat" && <ChatScreen />}
        {screen === "post" && <PostDetailScreen setScreen={setScreen} />}

        <BottomNav screen={screen} setScreen={setScreen} />
      </View>
    </View>
  );
}

function MapScreen({
  posts,
  loadPosts,
  setScreen,
}: {
  posts: Post[];
  loadPosts: () => void;
  setScreen: (screen: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>🔍 Search animals nearby...</Text>
        <Text style={styles.filterButton}>Filter</Text>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.blackPill}>Recent</Text>
        <Text style={styles.whitePill}>All</Text>
        <Text style={styles.locationPill}>📍 Approx. loc. ON</Text>
      </View>

      <View style={styles.mapArea}>
        <View style={styles.verticalLineOne} />
        <View style={styles.verticalLineTwo} />
        <View style={styles.horizontalLineOne} />
        <View style={styles.horizontalLineTwo} />

        <View style={styles.parkBox}>
          <Text style={styles.parkText}>park</Text>
        </View>

        {posts.map((post, index) => (
          <TouchableOpacity
            key={post.id}
            style={[
              styles.pin,
              {
                left: 45 + (index % 3) * 115,
                top: 65 + (index % 5) * 95,
              },
            ]}
            onPress={() => setScreen("post")}
          >
            <Text style={styles.pinCircle}>{animalEmoji(post.animal_category)}</Text>
            <Text style={styles.pinLabel}>{post.animal_category}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.locationButton} onPress={loadPosts}>
          <Text style={styles.locationButtonText}>◎</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PostDetailScreen({ setScreen }: { setScreen: (screen: string) => void }) {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => setScreen("map")}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.smallAvatar} />
        <View>
          <Text style={styles.boldText}>username</Text>
          <Text style={styles.grayText}>2 min ago · ~0.3 mi away</Text>
        </View>
        <Text style={styles.moreText}>...</Text>
      </View>

      <View style={styles.photoBox}>
        <Text style={styles.grayText}>[ Animal Photo ]</Text>
      </View>

      <View style={styles.postBody}>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>#dog</Text>
          <Text style={styles.tag}>#golden-retriever</Text>
          <Text style={styles.tag}>#irvine</Text>
        </View>

        <Text style={styles.captionText}>
          Found this sweet golden at Mason Park! He was very friendly 🐾
        </Text>

        <Text style={styles.noticeBox}>📍 Approx. location shown · Posted with 15 min delay</Text>

        <View style={styles.miniMap}>
          <Text style={styles.grayText}>[ Mini Map Preview · fuzzy pin ]</Text>
        </View>

        <Text style={styles.actionRow}>🐾   💬   ⚑</Text>

        <View style={styles.comments}>
          <Text style={styles.grayText}>2 comments</Text>
          <Text>user2    What breed is he?</Text>
          <Text>user3    Saw him yesterday too! 🙌</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function UploadScreen({
  animalCategory,
  setAnimalCategory,
  caption,
  setCaption,
  hashtags,
  setHashtags,
  selectedImage,
  pickImage,
  createPost,
}: {
  animalCategory: string;
  setAnimalCategory: (value: string) => void;
  caption: string;
  setCaption: (value: string) => void;
  hashtags: string;
  setHashtags: (value: string) => void;
  selectedImage: string | null;
  pickImage: () => void;
  createPost: () => void;
}) {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.uploadHeader}>
        <Text style={styles.cancelText}>× Cancel</Text>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={createPost}>
          <Text style={styles.shareText}>Share →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.uploadBody}>
        <View style={styles.uploadTop}>
          <TouchableOpacity style={styles.mediaBox} onPress={pickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <Text style={styles.grayText}>Tap to add{"\n"}Photo / Video</Text>
            )}
          </TouchableOpacity>

          <View style={styles.uploadSide}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.row}>
              <Text style={styles.blackPill}>📷 Photo</Text>
              <Text style={styles.whitePill}>🎥 Video</Text>
            </View>

            <Text style={styles.label}>Animal Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dog, Duck, Deer..."
              value={animalCategory}
              onChangeText={setAnimalCategory}
            />
          </View>
        </View>

        <Text style={styles.label}>Caption</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        <Text style={styles.label}>Hashtags</Text>
        <TextInput
          style={styles.input}
          placeholder="# Add tags (e.g. #golden-retriever, #park)"
          value={hashtags}
          onChangeText={setHashtags}
        />

        <View style={styles.settingsBox}>
          <Text style={styles.boldText}>📍 Location Settings</Text>
          <View style={styles.settingRow}>
            <Text>Use approximate location</Text>
            <Text style={styles.toggle}>●</Text>
          </View>
          <View style={styles.settingRow}>
            <Text>Delay post (15 min)</Text>
            <Text style={styles.toggle}>●</Text>
          </View>
        </View>

        <View style={styles.visibilityRow}>
          <Text style={styles.grayText}>Visibility:</Text>
          <Text style={styles.blackPill}>🌐 Public</Text>
          <Text style={styles.whitePill}>🔒 Followers</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  const animals = ["🦆", "🐕", "🦌", "🐈", "🦊", "🐇", "🦆", "🐕", "🦌"];

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.profileHeader}>
        <Text style={styles.username}>@username</Text>
        <Text style={styles.grayText}>⚙️ Settings</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatar} />
        <View style={styles.stat}><Text style={styles.statNumber}>12</Text><Text style={styles.grayText}>Posts</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>340</Text><Text style={styles.grayText}>Followers</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>89</Text><Text style={styles.grayText}>Following</Text></View>
      </View>

      <View style={styles.bio}>
        <Text style={styles.displayName}>Display Name</Text>
        <Text style={styles.grayText}>Animal spotter 🦌 | Irvine, CA | Documenting local wildlife</Text>
        <View style={styles.row}>
          <Text style={styles.whitePill}>🌐 Public Account</Text>
          <Text style={styles.blackPill}>Edit Profile</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Grid</Text>
        <Text style={styles.tab}>Map View</Text>
        <Text style={styles.tab}>Saved</Text>
      </View>

      <View style={styles.grid}>
        {animals.map((animal, index) => (
          <View key={index} style={styles.gridItem}>
            <Text style={styles.gridAnimal}>{animal}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ChatScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Nearby Chat</Text>
        <Text style={styles.grayText}>Transient · messages expire after 24h</Text>
      </View>

      <View style={styles.chatFilters}>
        <Text style={styles.blackPill}>Near me</Text>
        <Text style={styles.whitePill}>Mason Park</Text>
        <Text style={styles.whitePill}>Post #4F2</Text>
      </View>

      <View style={styles.messageRow}>
        <View style={styles.chatAvatar} />
        <View>
          <Text style={styles.grayText}>nearby_user · 3m ago</Text>
          <Text style={styles.leftBubble}>Anyone else see the deer at Mason Park this morning?</Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        <Text style={styles.rightBubble}>Yes! I just posted a photo 🦌</Text>
      </View>

      <View style={styles.messageRow}>
        <View style={styles.chatAvatar} />
        <View>
          <Text style={styles.grayText}>nearby_user · 1m ago</Text>
          <Text style={styles.leftBubble}>So cool, was it near the trail?</Text>
        </View>
      </View>

      <Text style={styles.expireText}>⌛ Messages expire in 23h 50m</Text>

      <View style={styles.chatInputRow}>
        <TextInput style={styles.chatInput} placeholder="Message nearby..." />
        <Text style={styles.sendButton}>↑</Text>
      </View>
    </View>
  );
}

function BottomNav({
  screen,
  setScreen,
}: {
  screen: string;
  setScreen: (screen: string) => void;
}) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => setScreen("map")}>
        <Text style={screen === "map" ? styles.navActive : styles.navText}>🗺️{"\n"}Map</Text>
      </TouchableOpacity>

      <Text style={styles.navText}>🔍{"\n"}Explore</Text>

      <TouchableOpacity style={styles.cameraButton} onPress={() => setScreen("upload")}>
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("chat")}>
        <Text style={screen === "chat" ? styles.navActive : styles.navText}>💬{"\n"}Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("profile")}>
        <Text style={screen === "profile" ? styles.navActive : styles.navText}>👤{"\n"}Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

function animalEmoji(animal: string) {
  const lower = animal?.toLowerCase() || "";
  if (lower.includes("duck")) return "🦆";
  if (lower.includes("dog")) return "🐕";
  if (lower.includes("cat")) return "🐈";
  if (lower.includes("deer")) return "🦌";
  if (lower.includes("fox")) return "🦊";
  return "🐾";
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#f7f7f7",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingBottom: 80,
  },
  searchBar: {
    margin: 16,
    height: 44,
    borderRadius: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchText: {
    color: "#999",
  },
  filterButton: {
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    color: "#777",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  blackPill: {
    backgroundColor: "#222",
    color: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    overflow: "hidden",
  },
  whitePill: {
    backgroundColor: "white",
    color: "#666",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  locationPill: {
    marginLeft: "auto",
    backgroundColor: "white",
    color: "#666",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  mapArea: {
    flex: 1,
    backgroundColor: "#d6d0c2",
    position: "relative",
    overflow: "hidden",
  },
  verticalLineOne: {
    position: "absolute",
    left: "35%",
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#c4bcad",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  verticalLineTwo: {
    position: "absolute",
    left: "72%",
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#c4bcad",
  },
  horizontalLineOne: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#c4bcad",
  },
  horizontalLineTwo: {
    position: "absolute",
    top: "68%",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#c4bcad",
  },
  parkBox: {
    position: "absolute",
    left: 45,
    top: 240,
    width: 130,
    height: 95,
    backgroundColor: "#c6ddb2",
    borderWidth: 1,
    borderColor: "#9abc77",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  parkText: {
    color: "#6c8b57",
  },
  pin: {
    position: "absolute",
    alignItems: "center",
  },
  pinCircle: {
    backgroundColor: "#222",
    color: "white",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "white",
    overflow: "hidden",
    fontSize: 18,
  },
  pinLabel: {
    marginTop: 2,
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 65,
    fontSize: 12,
    overflow: "hidden",
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  locationButtonText: {
    fontSize: 24,
  },
  uploadHeader: {
    height: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  shareText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  uploadBody: {
    padding: 18,
  },
  uploadTop: {
    flexDirection: "row",
    gap: 16,
  },
  mediaBox: {
    width: 145,
    height: 150,
    backgroundColor: "#e6e6e6",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    padding: 12,
  },
  uploadSide: {
    flex: 1,
  },
  label: {
    color: "#999",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
  },
  captionInput: {
    height: 92,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  settingsBox: {
    marginTop: 20,
    backgroundColor: "#e4e4e4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  toggle: {
    backgroundColor: "#222",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  visibilityRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 18,
  },
  postHeader: {
    height: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  backArrow: {
    fontSize: 28,
  },
  smallAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  boldText: {
    fontWeight: "bold",
  },
  grayText: {
    color: "#888",
  },
  moreText: {
    marginLeft: "auto",
    color: "#888",
  },
  photoBox: {
    height: 230,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  postBody: {
    padding: 16,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: "#666",
  },
  captionText: {
    marginTop: 14,
    fontSize: 15,
  },
  noticeBox: {
    marginTop: 18,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "#666",
  },
  miniMap: {
    height: 90,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    padding: 12,
    marginTop: 12,
  },
  actionRow: {
    fontSize: 24,
    marginTop: 18,
  },
  comments: {
    marginTop: 18,
    gap: 8,
  },
  profileHeader: {
    height: 70,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 22,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#e5e5e5",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bio: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 8,
  },
  displayName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  tabs: {
    height: 36,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  activeTab: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  tab: {
    color: "#aaa",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "33.33%",
    height: 140,
    backgroundColor: "#e5e5e5",
    borderWidth: 0.5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  gridAnimal: {
    fontSize: 28,
  },
  chatHeader: {
    height: 80,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  chatTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  chatFilters: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 18,
    marginTop: 12,
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  leftBubble: {
    backgroundColor: "#e5e5e5",
    padding: 14,
    borderRadius: 14,
    maxWidth: 260,
    overflow: "hidden",
  },
  rightRow: {
    alignItems: "flex-end",
    marginRight: 24,
    marginTop: 16,
  },
  rightBubble: {
    backgroundColor: "#222",
    color: "white",
    padding: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  expireText: {
    color: "#999",
    textAlign: "center",
    marginTop: 18,
  },
  chatInputRow: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatInput: {
    flex: 1,
    height: 48,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
    color: "white",
    textAlign: "center",
    lineHeight: 48,
    fontSize: 24,
    overflow: "hidden",
  },
  bottomNav: {
    height: 78,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navText: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 12,
  },
  navActive: {
    color: "#111",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  cameraButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#222",
    borderWidth: 4,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  cameraIcon: {
    fontSize: 24,
  },
});