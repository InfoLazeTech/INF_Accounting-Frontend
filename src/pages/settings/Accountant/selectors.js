// src/features/account/selectors.js
export const selectAccountTree = (state) => {
  const accounts = state.account.accounts;
  const mapNode = (node) => ({
    ...node,
      _id: node.id,
    accountname: node.accountName,
    accountcode: node.accountCode,
    parenttype: node.parentType,
    isGroup: node.children && node.children.length > 0,
    key:node.id || `group-${node.accountName}`,
    children: node.children?.map(mapNode) || [],
  });

  return accounts.map(mapNode);
};