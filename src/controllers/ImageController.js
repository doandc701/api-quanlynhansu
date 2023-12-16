import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { signInWithEmailAndPassword } from "@firebase/auth";
import Image from "../models/image.model.js";
import analytics from "../config/firebase.config.js";
import "dotenv/config";

const authFirebase = await signInWithEmailAndPassword(
  analytics,
  process.env.FIREBASE_USER,
  process.env.FIREBASE_AUTH
).catch(() => {});
const storageFB = getStorage();

async function uploadImage(file, quantity) {
  if (quantity === "single") {
    const dateTime = Date.now();
    const fileName = `images/${file.origin_name}`;
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
  const qsort = req.query.sorts || { _id: "desc" };
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
  if (req.file) {
    // const findExit = await Image.findOne({
    //   origin_name: req.file.originalname,
    // }).catch(() => {});

    // if (findExit) {
    //   return res.status(422).json({ message: "Ảnh đã tồn tại !" });
    // }
    const image = new Image();
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
      origin_name: req.file.originalname,
    };
    try {
      const buildImage = await uploadImage(file, "single");
      image.path = buildImage;
      image.origin_name = req.file.originalname;
      image
        .save()
        .then((add) => {
          res.status(200).json(add);
        })
        .catch((error) => {
          res.status(401).json({ message: error });
        });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
}

function PUT_IMAGE(req, res) {
  Image.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_IMAGE(req, res) {
  const recorDelete = await Image.findOne({ _id: req.params.code }).catch(
    () => {}
  );
  if (!recorDelete) {
    return res.status(404).json({ message: "Không tìm thấy ảnh cần xóa!" });
  }

  if (!authFirebase) {
    return res
      .status(404)
      .json({ message: "Đăng nhập firebase không thành công!" });
  }
  const fileName = `images/${recorDelete.origin_name}`;
  const fileRef = ref(storageFB, fileName);
  await deleteObject(fileRef).catch(() => {});
  Image.deleteOne({ _id: recorDelete._id })
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export { GET_IMAGE, POST_IMAGE, PUT_IMAGE, DELETE_IMAGE };
