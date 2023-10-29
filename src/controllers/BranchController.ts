import { Request, Response } from "express";
import Branchs from "../models/branch.model";

async function GET_BRANCH(req: Request, res: Response) {
  const page = req.query.p || 1;
  const showLimit: number = 10;
  const searchs = req.query.search;
  Branchs.find({})
    .limit(showLimit)
    .skip(Number(page) * showLimit)
    .then((data) => {
      if (searchs) {
        const results = data.filter((item) => {
          return (
            item.code
              .toLowerCase()
              .indexOf(searchs.toString().toLowerCase()) !== -1
          );
        });
        res.status(200).send(results);
      } else {
        res.status(200).send(data);
      }
    })
    .catch(() => {
      res.status(401).send({ message: "Could not fetch the documents" });
    });
}

async function POST_BRANCH(req: Request, res: Response) {
  const branch = new Branchs(req.body);
  await branch
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

function PUT_BRANCH(req: Request, res: Response) {
  Branchs.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_BRANCH(req: Request, res: Response) {
  await Branchs.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_BRANCH, POST_BRANCH, PUT_BRANCH, DELETE_BRANCH };
