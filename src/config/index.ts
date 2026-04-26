import dotEnv from "dotenv"
import path from "path"


dotEnv.config({ path: path.join(__dirname, "../../.env") })

export default {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecter: process.env.SUPER_SECRET,
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_TOKEN || process.env.CLOUDINARY_API_SECRET,
    }
}