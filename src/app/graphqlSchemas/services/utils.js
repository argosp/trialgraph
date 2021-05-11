exports.mergeDeep = (...objects) => {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && pVal.length && Array.isArray(oVal) && oVal.length) {
          if (pVal[0] && pVal[0].key) {
            oVal.forEach(v => {
              let index = pVal.findIndex(p => p.key === v.key)
              if (index !== -1) {
                pVal[index] = this.mergeDeep(pVal[index], v);
              } else {
                pVal.push(v);
              }
            })
            prev[key] = pVal;

          } else prev[key] = pVal.concat(...oVal);
        } else if (!Array.isArray(pVal) && isObject(pVal) && isObject(oVal) && !Array.isArray(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }