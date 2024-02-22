const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function insertData(serverID, name, link, userID) {
  try {
    await prisma.MediaTable.create({
      data: {
        name: name,
        link: link,
        author_id: userID,
        server_id: serverID,
      },
    });
    return { status: true };
  } catch (e) {
    if (e.code === "P2002") {
      return {
        status: false,
        message: "There is already a link with this media",
      };
    }
    if (e.code == "P2000") {
      return { status: false, message: "The media link is too large" };
    } else {
      console.log(e);
    }
  }
  return false;
}

async function deleteData(serverID, name) {
  const deleteUser = await prisma.MediaTable.deleteMany({
    where: {
      server_id: {
        contains: serverID,
      },
      name: {
        contains: name,
      },
    },
  });
  if (deleteUser.count == 1) {
    return true;
  }
  return false;
}

async function queryData(serverID, name) {
  try {
    const user = await prisma.MediaTable.findUnique({
      where: {
        UniqueNameIdentifier: {
          server_id: serverID,
          name: name,
        },
      },
    });
    if (user != null) {
      return user.link;
    }
    return false;
  } catch (e) {
    if (e.code == "P2022") {
      console.log("nothing in server");
      return false;
    } else {
      console.log(e);
    }
  }
  return false;
}
async function dbStatus() {
  try {
    const count = await prisma.MediaTable.aggregate({
      _count: {
        id: true,
      },
    });
    return count;
  } catch (error) {
    console.error("Error checking database status:", error.message);
    return false
  }
}

async function queryAll(serverID) {
  try {
    const user = await prisma.MediaTable.findMany({
      where: {
        server_id: serverID,
      },
    });
    return user;
  } catch (e) {
    if (e.code == "P2022") {
      console.log("nothing in server");
    }
  }
}

async function queryKeys(serverID) {
  const res = await prisma.MediaTable.findMany({
    where: {
      server_id: serverID,
    },
    select: {
      name: true,
    },
  });
  return res;
}

async function queryKeysFilter(serverID, filter) {
  const user =
    await prisma.$queryRaw`SELECT * FROM MediaTable WHERE server_id=${serverID} AND ( SOUNDEX(${filter}) = SOUNDEX(name) OR name LIKE ${"%" + filter + "%"
      })`;
  if (user.length != 0) {
    return user;
  }
  return false;
}

async function clearTable(serverID) {
  const count = await prisma.MediaTable.deleteMany({
    where: {
      server_id: serverID,
    },
  });
  return count
}

async function updateName(serverID, name, newName) {
  try {
    const res = await prisma.MediaTable.update({
      where: {
        UniqueNameIdentifier: {
          server_id: serverID,
          name: name,
        },
      },
      data: {
        name: newName,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
}
async function updateMedia(serverID, name, newMedia) {
  try {
    const res = await prisma.MediaTable.update({
      where: {
        UniqueNameIdentifier: {
          server_id: serverID,
          name: name,
        },
      },
      data: {
        link: newMedia,
      },
    });
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
}

async function queryAuthor(serverID, name) {
  const res = await prisma.MediaTable.findUnique({
    where: {
      UniqueNameIdentifier: {
        server_id: serverID,
        name: name,
      },
    },
    select: {
      author_id: true,
    },
  });
}

module.exports = {
  insertData,
  deleteData,
  queryAll,
  queryKeys,
  queryKeysFilter,
  queryData,
  updateName,
  updateMedia,
  queryAuthor,
  clearTable,
  dbStatus,
};
