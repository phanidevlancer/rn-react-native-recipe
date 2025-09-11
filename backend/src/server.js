import express from 'express'
import { ENV } from './config/env.js'
import { db } from './config/db.js'
import { favoritesTable } from './db/schema.js'
import { eq, and } from "drizzle-orm"


const app = express()
const port = ENV.PORT

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true })
})

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const userFavourites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId))
        console.log("userFavourites", userFavourites)
        res.status(200).json({
            success: true,
            recordsCount: userFavourites.length,
            favourites: userFavourites
        })
    } catch (error) {
        res.status(404).json({ error: `Failed to fetch records` })
        console.log("userFavourites error", error)
    }

})

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params

        const deletedRecords = await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
        ).returning()
        console.log("deletedRecords", deletedRecords)
        if (deletedRecords.length > 0) {
            res.status(200).json({
                success: true,
                deletedRecord: deletedRecords[0]
            })
        } else {
            res.status(404).json({ error: `Record with recipe id ${recipeId} not associated with userId ${userId} ` })
        }

    } catch (error) {
        console.log("error while deleting", error)
    }
})


app.post("/api/favorites", async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, serving } = req.body
        if (!userId || !recipeId || !title) {
            return res.status(400).json({ error: "Missing required fields", mandateFeilds: "<userId|recipeId|title>" })
        }

        const existing = await db
            .select()
            .from(favoritesTable)
            .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, recipeId)))

        console.log("existing ", existing)

        if (existing.length > 0) {
            return res.status(409).json({ error: "Recipe already in favorites" })
        }

        const fav = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            serving
        })
            .returning()
        res.status(201).json(
            {
                success: true,
                data: fav[0]
            }
        )
    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                success: false,
                error: "Internal server error"
            }
        )
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})