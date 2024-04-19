export const bookFilterableFields = [
  "searchTerm",
  "minPrice",
  "maxPrice",
  "category",
];

export const bookSearchableFields = ["title", "author", "genre"];

export const bookRelationalFieldsMapper: { [key: string]: string } = {
  category: "category",
  // "fieldsOrQueryParamOfCategory":"category"
};
