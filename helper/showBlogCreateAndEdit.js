const Account = require('../models/account.model');

module.exports.showDataIndex = async (record) => {
  for (let item of record) {
    if (item.createdBy && item.createdBy.account_id) {
      const user = await Account.findOne({
        _id: item.createdBy.account_id,
      });
      item.createdBy.accountFullName = user.fullName;
    }

    if (item.updatedBy && item.updatedBy.length) {
      const updatedBy = item.updatedBy[item.updatedBy.length - 1];
      const user = await Account.findOne({
        _id: updatedBy.account_id,
      });
      item.updatedBy[item.updatedBy.length - 1].accountFullName = user.fullName;
    }
  }
};
