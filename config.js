module.exports = (fs, root) => {
    return {
        port: process.env.PORT || 80,
        rootDir: root,
        hostname: "localhost",
        protocol: "http",
        assetsDir: "assets",
        dbAdress: "bluetick-db:27017",
        dbName: "bluetick"
    };
};
