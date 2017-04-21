module.exports = (fs, root) => {
    return {
        port: 80,
        securePort: process.env.PORT || 443, // set our port
        rootDir: root,
        //hostname: "fe373ad8.ngrok.io"
        //hostname: "b5c24150.ngrok.io"
        hostname: "localhost",
        protocol: "https",
        assetsDir: "assets",
        ssl: {
            key: fs.readFileSync(root + '/ssl/privatekey.key'),
            cert: fs.readFileSync(root + '/ssl/certificate.crt')
        }
    };
};
