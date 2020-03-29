import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const createGame = functions.firestore
  .document("games/{gameId}")
  .onCreate((snap, context) => {
    return getRandomWord()
      .then(word => {
        return word;
      })
      .then(word => {
        return snap.ref.set(
          {
            word: word,
            currentTurn: 0
          },
          { merge: true }
        );
      })
      .catch(error => {
        console.log(error);
        return snap.ref.set(
          {
            word: "",
            currentTurn: 0
          },
          { merge: true }
        );
      });
  });

export const endTurn = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  const turn = req.body;
  return admin
    .firestore()
    .collection("games")
    .doc(turn.gameId)
    .get()
    .then(doc => {
      if (!doc || !doc.exists) {
        return res.status(404).send({ error: "Game not found" });
      }

      const data = doc.data();
      console.error(data);
      if (!data) {
        return res.status(404).send({ error: "Game not found" });
      }

      if (data.currentTurn !== turn.currentTurn) {
        return res.status(400).send({ error: "Game turn it's over" });
      }

      const nextTurn = (data.currentTurn + 1) % data.users.length;
      data.users[data.currentTurn].points += turn.points;
      return getRandomWord()
        .then(word => {
          console.log(word);
          return doc.ref.set(
            {
              word: word,
              currentTurn: nextTurn,
              users: data.users
            },
            { merge: true }
          );
        })
        .then(_result => {
          return res.status(200).send({ nextTurn: nextTurn });
        })
        .catch(error => {
          console.log(error);
          return res.status(500).send({ error: "Internal server error" });
        });
    })
    .catch(error => {
      console.error(error);
      return res.status(404).send({ error: "Game not found" });
    });
});

const getRandomWord = (randomId?: string): Promise<string> => {
  let searchId = randomId;
  if (!searchId) {
    searchId = admin
      .firestore()
      .collection("tmp")
      .doc().id;
  }
  return admin
    .firestore()
    .collection("words")
    .where("random", randomId ? "<" : ">=", searchId)
    .orderBy("random", "asc")
    .limit(1)
    .get()
    .then(querySnapshot => {
      let found = "null";
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        found = doc.data().word;
        console.log("Found: " + found);
      });

      if (!found && !randomId) {
        return getRandomWord(searchId);
      }

      return found;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
      return "null";
    });
};
