const DEFAULT_USER = {
  $id: "00000000-0000-0000-0000-000000000001",
  name: "User",
  email: "user@localhost",
};

export const getCurrent = async () => {
  return DEFAULT_USER;
};
