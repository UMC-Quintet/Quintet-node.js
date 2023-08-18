let cachedUser = null;

module.exports = {
    getUser: () => cachedUser,
    setUser: (user) => {
        cachedUser = user;
    },
};