import db, { UserRole } from "./index"
import fs from "fs"
import { SecurePassword } from "blitz"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
  if (process.env.NODE_ENV === "production") {
    try {
      if (
        process.env.SITE_ADMIN_USERNAME &&
        process.env.SITE_ADMIN_EMAIL &&
        process.env.SITE_ADMIN_PASSWORD
      ) {
        const hashedPassword = await SecurePassword.hash(process.env.SITE_ADMIN_PASSWORD.trim())
        await db.user.create({
          data: {
            name: process.env.SITE_ADMIN_USERNAME,
            email: process.env.SITE_ADMIN_EMAIL,
            hashedPassword: hashedPassword,
            role: UserRole.SUPER,
          },
        })
      } else {
        throw new Error("Error reading site admin details from environment")
      }
    } catch (err) {
      console.log(`${err}\nAccount not seeded from environment`)
    }
  } else {
    fs.readFile("./config.json", "utf8", async (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err)
        return
      }
      const data = JSON.parse(jsonString)
      const hashedPassword = await SecurePassword.hash(data["password"].trim())
      await db.user.create({
        data: {
          name: data["username"],
          email: data["email"],
          hashedPassword: hashedPassword,
          role: UserRole.SUPER,
        },
      })
    })
  }
}

export default seed
