# Halden Motor House

A small showroom site. You describe the job a car has to do, and the app ranks the cars in `data/cars.json`. Opening a car shows its price, photos, and the dealers that have it in stock.

Search calls Google Gemini. The catalog itself stays in this project. Nothing is charged when you request an offer or book a test drive.

## What you need

- [Node.js](https://nodejs.org) 20.9 or newer
- npm (included with Node.js)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Set it up

1. Clone this repository and open the project folder.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a file named `.env.local` in the project folder (the same folder as `package.json`) and add your key:

   ```bash
   GEMINI_API_KEY=your_key_here
   ```

   Use your own key. Do not share that file.

4. Start the site:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

If you change `.env.local`, stop the dev server and run `npm run dev` again. Next.js only reads that file when the server starts.

## Use the site

- On the home page, type what you need the car to do, or choose an example under the search box. A search usually takes several seconds.
- **Refine filters** narrows the showroom by body, doors, gearbox, and fuel before you search. After a search, matching filters appear above the results and can be removed.
- Open a car to see its details, request an offer, or book a test drive. Those forms stay in the browser.
- **Find your dealer** lists showrooms that stock that car. **Search near me** asks the browser for your location and sorts those showrooms by distance.

## Change the catalog

- Cars live in `data/cars.json`. Each car needs an `id`, name, price, photo path, body, doors, drivetrain, fuel, seats, transmission, colour, highlights, and description.
- Photos are files in `public/cars/`. Point a car's `image` field at one of them, for example `/cars/prius.jpg`.
- Dealers live in `data/dealers.json`. A dealer's `stock` array lists the car `id`s that showroom has available.

Save the file and refresh the page. You do not need to restart the server for catalog edits.

## Other commands

```bash
npm run lint
npm run build
npm start
```

`npm start` serves the production build on [http://localhost:3000](http://localhost:3000). It also needs `.env.local`.

## If search fails

- The page says to add `GEMINI_API_KEY`: the file is missing, the name is wrong, or the dev server was not restarted after you added the key.
- A Gemini error usually means the key is invalid or the request was rejected. Create a new key in Google AI Studio and restart `npm run dev`.
- Port 3000 is already in use: stop the other process, or run `npx next dev -p 3001` and open [http://localhost:3001](http://localhost:3001).
