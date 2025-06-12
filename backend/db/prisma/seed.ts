import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const desks = await prisma.desk.createMany({
    data: [
      {number: 1}, 
      {number: 2}, 
      {number: 3},
      {number: 4}, 
      {number: 5}, 
      {number: 6},
      {number: 7}, 
    ],
  });

  console.log(desks);

  const departments = await prisma.department.createMany({
    data: [
      {
        name: "Insurance",
        name_es: "Aseguranza"
      },
      {
        name: "Motor Vehicle Services",
        name_es: "Placas / Titulos"
      },
      {
        name: "Driver's License",
        name_es: "Licencias"
      },
    ],
  });

  console.log(departments);

  // const client1 = await prisma.client.create({
  //   data: {
  //     department: {
  //       connect: { code: "ins" },
  //     },
  //   },
  // });

  // const client2 = await prisma.client.create({
  //   data: {
  //     department: {
  //       connect: { code: "ins" },
  //     },
  //   },
  // });

  // const client3 = await prisma.client.create({
  //   data: {
  //     department: {
  //       connect: { code: "mvs" },
  //     },
  //   },
  // });

  // console.log(client1, client2, client3);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
