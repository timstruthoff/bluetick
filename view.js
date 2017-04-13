module.exports = (config, path) => {
    return (viewName) => {

        return require(path.join(config.rootDir, "views", viewName + ".js"));
    }
}
