import moment = require('moment');

export function generateSortQuery(sorts) {
  const sortKeyValues = getObjectKeyValues(sorts, false);

  let sortQuery = '';
  for (const key of sortKeyValues.keys()) {
    sortQuery += `"${key}" ${sortKeyValues.get(key)}`;
    sortQuery += `, `;
  }

  if (sortQuery !== '') {
    sortQuery = `ORDER BY ${sortQuery.substring(0, sortQuery.length - 2)}`;
  }

  return sortQuery;
}

export function generateWhereQuery(filters) {
  const filterKeyValues = getObjectKeyValues(filters);
  console.log(filterKeyValues);

  let whereQuery = '';
  for (const key of filterKeyValues.keys()) {
    const value = filterKeyValues.get(key);

    const isDateTime = moment(
      value,
      `'yyyy-MM-DDTHH:mm:ss.SSSZ'`,
      true,
    ).isValid();

    if (Array.isArray(value)) {
      console.log(value);

      let whereSubQuery = ``;
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (
          (typeof element == 'string' || element instanceof String) &&
          !isDateTime
        ) {
          whereSubQuery += `LOWER("${key}") like LOWER('${element.replaceAll(
            `'`,
            `%`,
          )}')`;
        } else {
          whereSubQuery += `"${key}" = ${element}`;
        }

        whereSubQuery += ` OR `;
      }

      if (whereSubQuery !== '') {
        whereQuery += `(${whereSubQuery.substring(
          0,
          whereSubQuery.length - 4,
        )})`;
      }
    } else {
      if (
        (typeof value == 'string' || value instanceof String) &&
        !isDateTime
      ) {
        whereQuery += `LOWER("${key}") like LOWER('${value.replaceAll(
          `'`,
          `%`,
        )}')`;
      } else {
        whereQuery += `"${key}" = ${value}`;
      }
    }

    whereQuery += ` AND `;
  }

  if (whereQuery !== '') {
    whereQuery = `WHERE ${whereQuery.substring(0, whereQuery.length - 5)}`;
  }

  return whereQuery;
}

function getObjectKeyValues(
  obj,
  isWhereQuery = true,
  previousPath = '',
  objectKeys = [],
  keyValues = new Map<string, any>(),
) {
  Object.keys(obj).forEach((key) => {
    const currentPath = previousPath ? `${previousPath}.${key}` : key;

    let value = obj[key];
    if (typeof value !== 'object') {
      if (
        (typeof value == 'string' || value instanceof String) &&
        isWhereQuery
      ) {
        value = `'${value}'`;
      }

      objectKeys.push(currentPath);
      keyValues.set(`${currentPath}`, value);
    } else if (Array.isArray(value)) {
      if (value.length == 0) {
        return;
      }
      const keys = [];
      Object.keys(value[0]).forEach((arrayKey) => {
        keys.push(arrayKey);
      });

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const valueArray = [];
        for (let index = 0; index < value.length; index++) {
          const objValue = value[index];
          valueArray.push(objValue[key]);
        }

        const globalKey = `${currentPath}.${key}`;
        objectKeys.push(globalKey);
        keyValues.set(`${globalKey}`, valueArray);
      }
    } else {
      getObjectKeyValues(
        value,
        isWhereQuery,
        currentPath,
        objectKeys,
        keyValues,
      );
    }
  });

  return keyValues;
}
