// src/features/account/selectors.js
export const selectAccountTree = (state) => {
  const accounts = state.account.accounts;
  const groups = {};

  accounts.forEach((acc) => {
    const type = acc.parenttype;
    if (!groups[type]) {
      groups[type] = {
        accountname: type,
        children: [],
        isGroup: true,
        _id: `group-${type}`,
      };
    }
    groups[type].children.push({ ...acc, children: [] });
  });

  return Object.values(groups);
};