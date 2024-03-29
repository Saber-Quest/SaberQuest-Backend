# This branch is currently stale, the rewrite is being done on the dev/knex/pgsql branch

## Why are you rewriting the project?!

In short, the web server was basically broken from release and didn't work properly half the time, and as such, this version of the web server is largely unsupported and anything gained/done on the current version will be lost when the rewrite releases.

## Are you a developer? We welcome contributions!

While yes, we're working on this largely internally, all of our code is open source under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) and welcomes contributions to make development go faster, making you, the end-user have the product faster. All questions regarding the project should be asked in [the developer channel](https://canary.discord.com/channels/1036356704742416505/1139295840465342558) in [the discord](https://discord.gg/ZRvXXqd9jM)

---

# API Endpoints

## Use these API endpoints if you want to get data from SaberQuest.

`/api/current-deals` - Returns a JSON array of all the items that are currently
being sold in the shop.

```js
{
    "message": "string",
    "deals": object[]
}

// Example of the deals object

{
    "id": "string",
    "price": int,
    "rarity": "string",
    "value": int
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

The websocket runs on port 8080, you can listen to it at `ws://saberquest.xyz:8080`.

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
    "userId": "string",
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
