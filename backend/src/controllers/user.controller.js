export const getUsers = (req, res) => {
  res.json({
    message: "GET users berhasil",
    data: []
  });
};

export const createUser = (req, res) => {
  const { name, email } = req.body;

  res.json({
    message: "User berhasil dibuat",
    user: { name, email }
  });
};
