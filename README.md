# SaberQuest-Backend

The backend code for SaberQuest

---

# API Endpoints

## Use these API endpoints if you want to get data from SaberQuest.

`/api/current-deals` - Returns a JSON array of all the items that are currently
being sold in the shop.

```js
{
    "message": "string",
    "deals": string[]
}
```

`/api/daily-challenges` - Returns a JSON array of the current challenges.

```js
{
    "message": "string",
    "type": "string",
    "task": "string",
    "dailyChallenges": object[]
}

// Daily Challenges object is different depending on the type of challenge.
```

`/api/items` - Returns a JSON array of all the items available on SaberQuest.
The objects contain the item ID, full name and where their image is being
stored.

```js
// Returns all of the objects in one response, example of one object below.

{
    "id": "string",
    "image": "string",
    "name": "string"
}
```

`/api/top-players` - Returns a JSON array of all the top players. Must include a
page query. Example: `/api/top-players?page=1`

```js
{
    "message": "string",
    "topPlayers": object[]
}

// Example of a topPLayers object

{
    "_id": "string",
    "userId": "string",
    "r": int, // Rank
    "cp": int, // Challenges completed
    "value": int
}
```

`/api/user` - Returns a JSON object of the requested user. Needed parameter is
the user ID. Example: `/api/user/76561198343533017`

```js
{
    "message": "string",
    "user": "string",
    "preference": "string",
    "rank": int,
    "qp": int, // Quest points
    "challengesCompleted": int,
    "collectibles": object[],
    "value": int,
    "diff": int, // Currently selected difficulty, 4 = none selected
    "completed": bool // If challenge is completed or not
}

// Example of collectibles object

{
    "name": "string",
    "amount": int
}
```

# Websocket

SaberQuest also has a websocket that you can listen to if you want to get all
the latest updates.

The websocket runs on port 8080, you can listen to it at
wss://saberquest.xyz:8080.

Each update has it's own specific event, so make sure to listen to the events
that you need.

## Events

`userUpdate` - Emitted each time a user gets a new collectible or gets one taken
away through crafting.

```js
{
    "userId": "string",
    "type": "string", // (add/remove)
    "collectibles": string[],
    "value": int
}
```

`challengeCompleted` - Emitted each time a user completes a challenge.

```js
{
    "id": "string",
    "difficulty": "string",
    "rewards": string[]
}
```

`itemBought` - Emitted each time a user buys a new collectible from the shop.

```js
{
    "userId": "string",
    "item": "string",
    "qp": int,
    "value": int
}
```

`newUser` - Emitted each time a new user gets added to SaberQuest.

```js
{
    "userId": "string",
    "link": "string"
}
```

`gamble` - Emitted each time a user gambles and gets something.

```js
{
    "userId": "string",
    "itemWon": "string",
    "rarity": "string"
}
```
