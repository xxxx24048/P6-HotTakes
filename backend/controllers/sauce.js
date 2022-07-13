const Sauce = require("../models/sauce");
const fs = require("fs");


//Get a sauce by id
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (!sauce) {
            return res.status(404).json({ message: "Sauce non trouvée !" });
        }
        return res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }));
};

//Creates a new sauce and uploads the image
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        //Image URL
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(500).json({ error }));
};

//Updates a sauce
exports.updateOneSauce = (req, res) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (!sauce) {
          return res.status(404).json({ message: "Sauce non trouvée !" });
        }
        //Gets the old image URL
        const filename = sauce.imageUrl.split("/images/")[1];
        //Deletes the old image
        fs.unlink(`images/${filename}`, () => {
            const sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            };
            Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
                )
                .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                .catch((error) => res.status(500).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
        const sauceObject = { ...req.body };
        Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
            )
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(500).json({ error }));
        }
    };

    //Deletes a sauce
    exports.deleteSauce = (req, res) => {
        Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ message: "Sauce non trouvée !" });
            }
            //Gets the old image URL
      const filename = sauce.imageUrl.split("/images/")[1];
      //Deletes the old image
      fs.unlink(`images/${filename}`, () => {
          sauce
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(500).json({ error }));
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

//Gets all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(sauces => res.status(200).json(sauces)) // Récupère toutes les sauces
        .catch(error => res.status(400).json({ error }));
};

//"Likes" and "Dislikes" (+1, 0, -1)

//Adds a like

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          const l = req.body.like
          const user = req.body.userId
          switch (l) {
              case 1:
                  if (!sauce.usersLiked.find(us => us == user)) {
                      sauce.likes++
                      sauce.usersLiked.push(user)
                  }
                  break
              case -1:
                  if (!sauce.usersDisliked.find(us => us == user)) {
                      sauce.dislikes++
                      sauce.usersDisliked.push(user)
                  }
                  break
              case 0:
                  let index = sauce.usersLiked.findIndex(us => us == user)
                  if (index != -1) {
                      console.log(index)
                      sauce.usersLiked.splice(index, 1)
                      sauce.likes--
                  }
                  else {
                      index = sauce.usersDisliked.findIndex(us => us == user)
                      console.log(index)
                      sauce.usersDisliked.splice(index, 1)
                      sauce.dislikes--
                  }
                  break
              default:
                  console.log("probleme")
          }
          sauce.save()
              .then(() => res.status(200).json({ message: "ok" }))
              .catch(error => res.status(400).json({ error }))
      })
      .catch(error => {
          console.log(error)
          res.status(404).json({ error })
      })
}