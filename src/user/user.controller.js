const prisma = require("../db/client");

exports.getUsers = async (req, resp) => {
  try {
    const users = await prisma.user.findMany();

    resp.status(201).json({ data: users });
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, resp) => {
  try {
    const { address, email, password } = req.body;
    const newUser = await prisma.user.create({
      data: {
        address,
        email,
        password,
      },
    });

    resp.status(201).json({ data: newUser });
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!id) return resp.status(400).json({ message: "Bad Request." });

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        address: true,
        email: true,
        username: true,
      },
    });

    if (!user) return resp.status(404).json({ message: "Not Found." });

    resp.status(200).json({ data: user });
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

// TODO: later on reconsider using upsert
exports.updateUserById = async (req, resp) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!id) return resp.status(400).json({ message: "Bad Request." });

    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        email,
      },
    });

    if (!user) return resp.status(404).json({ message: "Not Found." });

    resp.status(200).json({ data: user });
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!id) return resp.status(400).json({ error: "Bad Request." });

    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    if (!user) return resp.status(400).json({ error: "Not Found." });

    resp.sendStatus(204);
  } catch (error) {
    resp.status(500).json({ error: errorMessages.INTERNAL_SERVER_ERROR });
  }
};
