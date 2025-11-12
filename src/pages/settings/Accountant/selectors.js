
export const selectAccountTree = (state) => {
  const accounts = state.account.accounts;
  const map = {};
  const roots = [];

  accounts.forEach((acc) => {
    map[acc._id] = { ...acc, children: [] };
  });

  accounts.forEach((acc) => {
    if (acc.parenttype && map[acc.parenttype]) {
      map[acc.parenttype].children.push(map[acc._id]);
    } else {
      roots.push(map[acc._id]);
    }
  });

  return roots;
};