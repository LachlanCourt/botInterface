import db from "./index"
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
  fs.readFile("./config.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err)
      return
    }
    const data = JSON.parse(jsonString)
    const hashedPassword = await SecurePassword.hash(data["password"].trim())
    await db.user.create({
      data: { name: data["username"], email: data["email"], hashedPassword: hashedPassword },
    })
  })
}

export default seed
