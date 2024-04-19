class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    //1 A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1 B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    this.query = this.query.find(parsedQuery);
    return this;
  }
}

module.exports = APIFeatures;
