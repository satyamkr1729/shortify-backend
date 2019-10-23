/* eslint-disable max-len */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const manipulator = function() {
  EventEmitter.call(this);
};

util.inherits(manipulator, EventEmitter);

manipulator.prototype.insert = function(table, values) {
  const self = this;
  if (!Array.isArray(values)) {
    values = [values];
  }
  const sql = `INSERT INTO ${table} VALUES (?)`;
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

manipulator.prototype.select = function(tables, requiredValues, condition, conditionValues, join, joinTable, joinCondition, modifier, modifierBy) {
  let search = '';
  const self = this;
  if (Array.isArray(requiredValues)) {
    search = requiredValues.join(', ');
  } else {
    search = requiredValues;
  }
  let sql = `SELECT ${search} FROM ${tables} `;
  // check joins
  if (join) {
    if (joinTable && joinCondition) {
      switch (join) {
        case 'inner': sql+=`inner join ${joinTable} on ${joinCondition} `; break;
        case 'left': sql+=`left join ${joinTable} on ${joinCondition} `; break;
        case 'right': sql+=`right join ${joinTable} on ${joinCondition} `; break;
      }
    } else {
      sql = '';
      self.emit('error', `[sql_error]: join table or join condition missing`);
    }
  }
  // check conditions
  if (condition) {
    if (conditionValues) {
      if (!Array.isArray(conditionValues)) {
        conditionValues = [conditionValues];
      }
      sql = `${sql} where ${condition} ?`;
    } else {
      sql = '';
      self.emit('error', '[sql_error]: Condition data not found');
    }
  }
  // check aggregate functions
  if (modifier) {
    if (modifierBy) {
      if (!Array.isArray(modifierBy)) {
        modifierBy = [modifierBy];
      }
      switch (modifier) {
        case 'group': sql+=`group by ${modifierBy.join(', ')}`; break;
        case 'order': sql+=`order by ${modifierBy.join(', ')}`; break;
      }
    } else {
      sql = '';
      self.emit('error', '[sql_error]: modifier missing');
    }
  }

  try {
    if (__connect && sql) {
      __connect.query(sql, conditionValues, (err, data) => {
        if (!err) {
          self.emit('selected', null, data);
        } else {
          self.emit('error', `[select_error]: ${err}`, null);
        }
      });
    } else {
      if (!__connnect) {
        self.emit('error', '[sql_error]: Sql connector not found');
      }
    }
  } catch (err) {
    self.emit('error', `[error]: ${error}`);
  }
};

module.exports = manipulator;
