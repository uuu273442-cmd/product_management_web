const Account = require('../models/account.model');

module.exports.showDetailEdit = async (record) => {
  if (record.updatedBy.length) {
    const n = Math.floor(record.updatedBy.length / 2);
    for (let i = record.updatedBy.length - 1; i >= n; i--) {
      const user = await Account.findOne({
        _id: record.updatedBy[i].account_id,
      });

      record.updatedBy[i].accountFullName = user.fullName;
    }
  }
};

module.exports.showDetailCreate = async (record) => {
  if (record.createdBy.account_id) {
    const user = await Account.findOne({ _id: record.createdBy.account_id });
    record.accountFullName = user.fullName;
  }
};
