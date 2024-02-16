import express from "express";
import providePage from "./aws";

const app = express();

app.get("/*", async (req, res) => {
  const { hostname, path } = req;
  const id = hostname.split(".")[0];

  const type = path.endsWith("html")
    ? "text/html"
    : path.endsWith("css")
    ? "text/css"
    : "application/javascript";

  try {
    const data = await providePage(id, path);
    if (data.body) {
      res.set("Content-Type", type);
      res.send(data.body);
    }
  } catch (err) {
    res.status(500).send("Error fetching page.");
  }
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
