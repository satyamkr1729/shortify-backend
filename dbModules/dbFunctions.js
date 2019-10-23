/* eslint-disable max-len */
const eventEmitter = require('events').EventEmitter;
const util = require('util');
const manipulator = function() {
  EventEmitter.call(this);
};

util.inherits(manipulator, eventEmitter);

manipulator.prototype.insert = function(table, values) {
  const self = this;
  if (!Array.isArray(values)) {
    values = [values];
  }
  const sql = `INSERT INTO ${table} VALUES ?`;
  try {
    if (__connect) {
      __connect.query(sql, [values], (err, results) => {
        if (!err) {
          self.emit('inserted', null);
        } else {
          self.emit('error', `[insert_error]: ${err}`);
        }
      });
    } else {
      self.emit('error', '[sql_error]: Sql connector not found');
    }
  } catch (err) {
    self.emit('error', `[error]: ${err}`);
  }
};

manipulator.prototype.select = function(tables, requiredValues, condition, conditionValues) {
  let search = '';
  if (Array.isArray(requiredValues)) {
    search = requiredValues.join(', ');
  } else {
    search = requiredValues;
  }
  const sql = `SELECT ${search} FROM ${tables}`;
  if (condition) {
    if (conditionValues) {
      if (!Array.isArray(conditionValues)) {
        conditionValues = [conditionValues];
      }
    } else {
      self.emit('error', '[sql_error]: Condition data not found');
    }
    sql = `${sql} where ?`;
  }

  try {
    if (__connect) {
      __connect.query(sql, conditionValues, (err, data) => {
        if (!err) {
          self.emit('selected', null, data);
        } else {
          self.emit('error', `[select_error]: ${err}`, null);
        }
      });
    } else {
      self.emit('error', '[sql_error]: Sql connector not found');
    }
  } catch (err) {
    self.emit('erro', `[error]: ${error}`);
  }
};

module.exports = manipulator;
