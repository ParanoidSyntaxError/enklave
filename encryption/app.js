const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const keys = new Map();

app.post('/encrypt', (req, res) => {
    try {
        const id = req.body.id;
        const data = req.body.data;

        let key = keys.get(id);
        if (!key) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 2048,
            });

            key = {
                public: publicKey.export({ type: 'pkcs1',format: 'pem' }),
                private: privateKey.export({ format: 'pem', type: 'pkcs1' })
            };
            keys.set(id, key);
        }

        const encryptedData = crypto.publicEncrypt(
            {
                key: key.public,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(data, "utf8")
        ).toString("base64");

        return res.send({
            data: encryptedData
        });
    } catch (error) {
        console.error(error);
    }

    return res.sendStatus(500);
});

app.post('/decrypt', (req, res) => {
    try {
        const id = req.body.id;
        const data = req.body.data;

        let key = keys.get(id);
        if (key) {
            const decryptedData = crypto.privateDecrypt(
                {
                    key: key.private,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                Buffer.from(data, "base64")
            ).toString("utf8");

            return res.send({
                data: decryptedData
            });
        }
    } catch (error) {
        console.error(error);
    }

    return res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});