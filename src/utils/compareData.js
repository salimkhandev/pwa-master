export const compareData = (oldData, newData) => {
    return JSON.stringify(oldData) !== JSON.stringify(newData);
};
