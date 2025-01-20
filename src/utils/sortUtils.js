export const getSortParamsByOption = (sortOption) => {
  const sortParams = {
    default: undefined,
    'title-asc': JSON.stringify({ title: 1 }),
    'title-desc': JSON.stringify({ title: -1 }),
    'date-asc': JSON.stringify({ createdAt: 1 }),
    'date-desc': JSON.stringify({ createdAt: -1 }),
    'view-asc': JSON.stringify({ views: 1 }),
    'view-desc': JSON.stringify({ views: -1 }),
  };

  return sortParams[sortOption];
};
