module.exports = (query) => {
  let view = {
    position: 'desc',
  };

  if (query.sortkey && query.valuekey) {
    delete view.position;
    view[query.sortkey] = query.valuekey;
  }

  return view;
};
