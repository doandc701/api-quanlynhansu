import { Request, Response } from "express";
import Position from "../models/position.model";

async function GET_POSITION(req: Request, res: Response) {
  const page = req.query.p || 1;
  const showLimit: number = 10;
  const searchs = req.query.search;
  Position.find({})
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

async function POST_POSITION(req: Request, res: Response) {
  const position = new Position(req.body);
  await position
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

function PUT_POSITION(req: Request, res: Response) {
  Position.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_POSITION(req: Request, res: Response) {
  await Position.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_POSITION, POST_POSITION, PUT_POSITION, DELETE_POSITION };
