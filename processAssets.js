module.exports = (config, path, fs, crypto, assetsCollection, mime) => {
    return new Promise((resolve, reject) => {
        assetsCollection.remove({}).then(() => {
            files = fs.readdirSync(config.assetsDir);
            console.log(files);
            var filesPromiseArray = [];
            files.forEach((file) => {
                filesPromiseArray.push(new Promise((resolve, reject) => {

                    console.log(file);
                    var filePath = path.join(config.assetsDir, file);
                    fs.stat(filePath, (err, stat) => {
                    	if (err) {
    						console.error(err);
    						return;
  						}

                        var md5sum = crypto.createHash('md5');

                        var s = fs.ReadStream(filePath);
                        s.on('data', function(d) {
                            md5sum.update(d);
                        });


                        s.on('end', function() {
                            var d = md5sum.digest('hex');
                            console.log(d);
                            var obj = {
                                filename: file,
                                md5: d,
                                ext: path.extname(filePath),
                                mime: mime.lookup(file),
                                cacheName: d + path.extname(filePath),
                                fullPath: filePath,
                                size: stat.size
                            };

                            assetsCollection.insertOne(obj)
                                .then(function(result) {

                                    resolve(obj);
                                })
                                .catch(function(err) {
                                    console.log(err);

                                });


                        });
                    });

                }));

            });

            Promise.all(filesPromiseArray).then((result) => {
                console.log(result);
                resolve(result);
            });
        });

    });

};
