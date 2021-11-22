// 分页查询
export const page = {
  current: { type: 'number', required: false, min: 1, default: 1 },
  pageSize: { type: 'number', required: false, min: 1, default: 10 },
  sortField: { type: 'string', required: false, default: '' },
  sortDesc: { type: 'boolean', required: false, default: false }
};
