import { Request, Response } from "express";
import Categories from "../models/category.model";

async function GET_CATEGORIES(req: Request, res: Response) {
  const page = req.query.p || 1;
  const showLimit: number = 10;

  Categories.find({})
    .limit(showLimit)
    .skip(Number(page) * showLimit)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(500).send({ message: "Could not fetch the documents" });
    });
}

async function POST_CATEGORIES(req: Request, res: Response) {
  const categories = new Categories(req.body);
  await categories
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
}

function PUT_CATEGORIES(req: Request, res: Response) {
  Categories.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
}

async function DELETE_CATEGORIES(req: Request, res: Response) {
  await Categories.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
}

export { GET_CATEGORIES, POST_CATEGORIES, PUT_CATEGORIES, DELETE_CATEGORIES };
