module.exports = (fs, root) => {
    return {
        port: process.env.PORT || 80,
        rootDir: root,
        hostname: "bluetick.tst.works",
        protocol: "http",
        assetsDir: "assets",
        dbAdress: "bluetick-db:27017",
        dbName: "bluetick"
    };
};
