module.exports = (fs, root) => {
    return {
        port: process.env.PORT || 80,
        rootDir: root,
        hostname: "localhost",
        protocol: "http",
        assetsDir: "assets",
        dbAdress: "db:27017",
        dbName: "test"
    };
};
