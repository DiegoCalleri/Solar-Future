const rowToApi = (row) => {
    if (!row) return null;
    const { id, created_at, updated_at, ...rest } = row;
    const out = { _id: id, ...rest };
    if (created_at !== undefined) out.createdAt = created_at;
    if (updated_at !== undefined) out.updatedAt = updated_at;
    return out;
};

const rowsToApi = (rows) => rows.map(rowToApi);

module.exports = { rowToApi, rowsToApi };
