import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { signInWithEmailAndPassword } from "@firebase/auth";
import Image from "../models/image.model.js";
import analytics from "../config/firebase.config.js";
import "dotenv/config";

async function uploadImage(file, quantity) {
  const storageFB = getStorage();
  await signInWithEmailAndPassword(
    analytics,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );
  if (quantity === "single") {
    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.type,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }
  if (quantity === "multiple") {
    for (let i = 0; i < file.images.length; i++) {
      const dateTime = Date.now();
      const fileName = `images/${dateTime}`;
      const storageRef = ref(storageFB, fileName);
      const metadata = {
        contentType: file.images[i].mimetype,
      };
      const saveImage = await Image.create({ imageUrl: fileName });
      file.item.imageId.push({ _id: saveImage._id });
      await file.item.save();
      await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);
    }
    return;
  }
}

async function GET_IMAGE(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts;
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const recordImage = await Image.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});
  const countRecord = await Image.countDocuments().catch(() => {});
  res.status(200).json({
    data: recordImage,
    current_page: page,
    limit: showLimit,
    total: countRecord,
  });
}

async function POST_IMAGE(req, res) {
  const image = new Image(req.body);
  if (req.file) {
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    try {
      const buildImage = await uploadImage(file, "single");
      image.path = buildImage;
      await image
        .save()
        .then((add) => {
          res.status(200).send(add);
        })
        .catch((error) => {
          res.status(422).send({ message: "Ảnh đã tồn tại !" });
        });
    } catch (error) {
      res.status(401).send({ message: error });
    }
  }
}

function PUT_IMAGE(req, res) {
  Image.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_IMAGE(req, res) {
  await Image.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_IMAGE, POST_IMAGE, PUT_IMAGE, DELETE_IMAGE };
