let cnt = 0;
const createTree = (data, parent_id = '') => {
  const tree = [];
  data.forEach((item) => {
    if (item.parent_id === parent_id) {
      cnt++;
      const newItem = item;
      newItem.index = cnt;
      const children = createTree(data, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

module.exports.tree = (data, parent_id = '') => {
  cnt = 0;
  const tree = createTree(data, (parent_id = ''));
  return tree;
};
