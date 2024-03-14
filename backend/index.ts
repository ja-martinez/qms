import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { body, matchedData, validationResult, param } from "express-validator";
import { auth } from "./firebase";
import cors from "cors";
import { print } from "./print";

const prisma = new PrismaClient();
const app = express();

app.use(cors());

app.use(express.json());

app.get("/desks", async (req, res, next) => {
  try {
    const desks = await prisma.desk.findMany({
      include: { client: true },
      orderBy: {
        number: "asc"
      }
    });
    res.json(desks);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.get("/clients", async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      include: { department: true },
    });
    res.json(clients);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.get("/departments", async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// enqueue client / create client
app.post("/clients", body("departmentId").isInt(), async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    try {
      const { departmentId } = matchedData(req);

      const newClient = await prisma.client.create({
        data: {
          department: {
            connect: { id: departmentId },
          },
        },
        include: {department: true}
      });
      res.json(newClient);
      print(newClient.id.toString(), newClient.department.name_es)
    } catch (e) {
      next(e);
      console.error(e);
    }
  } else {
    res.status(422).send({ errors: result.array() });
  }
});

/*  Authentication Middleware */
app.use(verifyToken);

// Call next client
app.post(
  "/desk/:deskId/callNext",
  param("deskId").isInt().toInt(),
  async (req, res, next) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { deskId } = matchedData(req);

      try {
        const nextClient = await callNextClient(deskId);
        res.json(nextClient);
      } catch (e) {
        next(e);
        console.error(e);
      }
    } else {
      res.status(422).send({ errors: result.array() });
    }
  }
);

// dequeue client from department
app.post(
  "/desk/:deskId/dequeue",
  param("deskId").isInt().toInt(),
  body("departmentId").isInt(),
  async (req, res, next) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { deskId, departmentId } = matchedData(req);
      // TODO: retry here or in dequeue?
      try {
        const nextClient = await dequeue(deskId, departmentId);
        res.json(nextClient);
      } catch (e) {
        next(e);
        console.error(e);
      }
    } else {
      res.status(422).send({ errors: result.array() });
    }
  }
);

// call client
app.post(
  "/desk/:deskId/call",
  param("deskId").isInt().toInt(),
  body("clientId").isInt(),
  async (req, res, next) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { deskId, clientId } = matchedData(req);

      try {
        const calledClient = await callClient(deskId, clientId);
        res.json(calledClient);
      } catch (e) {
        next(e);
        console.error(e);
      }
    }
  }
);

// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   console.error(err)
//   next(err)
// };

// app.use(errorHandler);

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);

// dequeue next client
async function callNextClient(deskId: number) {
  return await prisma.$transaction(async (tx) => {
    const nextClient = await tx.client.findFirst({
      where: {
        called: false,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!nextClient) {
      await tx.desk.update({
        data: {
          clientId: null,
        },
        where: {
          id: deskId,
        },
      });
      return nextClient;
    }

    // throws RecordNotFound
    const nextClientUpdated = await tx.client.update({
      data: {
        called: true,
        version: {
          increment: 1,
        },
      },
      where: {
        id: nextClient.id,
        version: nextClient.version,
        called: false,
      },
    });

    await tx.desk.update({
      data: {
        clientId: nextClient.id,
      },
      where: {
        id: deskId,
      },
    });

    return nextClientUpdated;
  });
}

// dequeue by department
async function dequeue(deskId: number, departmentId: number) {
  return await prisma.$transaction(async (tx) => {
    const nextClient = await tx.client.findFirst({
      where: {
        called: false,
        department: {
          id: departmentId,
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!nextClient) {
      await tx.desk.update({
        data: {
          clientId: null,
        },
        where: {
          id: deskId,
        },
      });
      return nextClient;
    }

    // throws RecordNotFound
    const nextClientUpdated = await tx.client.update({
      data: {
        called: true,
        version: {
          increment: 1,
        },
      },
      where: {
        id: nextClient.id,
        version: nextClient.version,
        called: false,
      },
    });

    await tx.desk.update({
      data: {
        clientId: nextClient.id,
      },
      where: {
        id: deskId,
      },
    });

    return nextClientUpdated;
  });
}

async function callClient(deskId: number, clientId: number) {
  return await prisma.$transaction(async (tx) => {
    // get client check if it's been called
    let client = await tx.client.findUniqueOrThrow({
      where: {
        id: clientId,
      },
    });

    if (client.called) {
      // if client has been called, check if it's linked to a desk and unlink them

      const clientDesk = await tx.desk.findUnique({
        where: {
          clientId: clientId,
        },
      });

      // remove from prev desk
      if (clientDesk) {
        await tx.desk.update({
          data: {
            clientId: null,
          },
          where: {
            id: clientDesk.id,
          },
        });
      }
    } else {
      // if client hasn't been called, update client to called

      // throws RecordNotFound
      client = await tx.client.update({
        data: {
          called: true,
          version: {
            increment: 1,
          },
        },
        where: {
          id: clientId,
          version: client.version,
          called: false,
        },
      });
    }

    // assign client to specified desk
    const desk = await tx.desk.update({
      data: {
        clientId,
      },
      where: {
        id: deskId,
      },
    });

    return client;
  });
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    await auth.verifyIdToken(token);
    next();
  } catch {
    return res.sendStatus(403);
  }
}
